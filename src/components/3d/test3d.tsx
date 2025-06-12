"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface StarData {
  id: number;
  position: THREE.Vector3;
  name: string;
  content: string;
  brightness: number;
}

interface StarModalProps {
  star: StarData | null;
  onClose: () => void;
}

// Modal component for displaying star content
function StarModal({ star, onClose }: StarModalProps) {
  if (!star) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-8 rounded-lg max-w-md w-full mx-4 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-300">{star.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        <div className="text-gray-300 leading-relaxed">{star.content}</div>
        <div className="mt-4 text-sm text-gray-500">
          Brightness: {star.brightness.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const starsRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [starsData] = useState<StarData[]>(() => generateStarsData());

  // Generate 5 prominent stars in easily visible positions
  function generateStarsData(): StarData[] {
    const stars: StarData[] = [
      {
        id: 0,
        position: new THREE.Vector3(0, 30, -80),
        name: "Polaris",
        content:
          "The North Star - a faithful guide that has helped navigators find their way for centuries. This bright beacon sits almost directly above Earth's North Pole, making it appear stationary while other stars rotate around it.",
        brightness: 0.9,
      },
      {
        id: 1,
        position: new THREE.Vector3(-50, -20, -70),
        name: "Sirius",
        content:
          "The brightest star in our night sky, Sirius is actually a binary star system located in the constellation Canis Major. This brilliant blue-white star has been revered by ancient civilizations and continues to captivate stargazers today.",
        brightness: 1.0,
      },
      {
        id: 2,
        position: new THREE.Vector3(55, -15, -75),
        name: "Vega",
        content:
          "Once the northern pole star and destined to be so again, Vega is one of the brightest stars visible from Earth. Located in the constellation Lyra, it was the first star ever photographed and has served as a standard for measuring stellar brightness.",
        brightness: 0.85,
      },
      {
        id: 3,
        position: new THREE.Vector3(-30, 0, -85),
        name: "Betelgeuse",
        content:
          "A red supergiant star in the constellation Orion, Betelgeuse is one of the largest known stars. This stellar giant is nearing the end of its life and will eventually explode as a spectacular supernova, visible even during daytime.",
        brightness: 0.8,
      },
      {
        id: 4,
        position: new THREE.Vector3(40, 10, -80),
        name: "Rigel",
        content:
          "A brilliant blue supergiant in Orion, Rigel is one of the most luminous stars known. Despite being labeled as Beta Orionis, it often appears brighter than Betelgeuse. This stellar powerhouse shines with the light of 120,000 suns.",
        brightness: 0.9,
      },
    ];

    return stars;
  }

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create stars group
    const starsGroup = new THREE.Group();
    starsRef.current = starsGroup;
    scene.add(starsGroup);

    // Create individual stars
    starsData.forEach((starData) => {
      const starGeometry = new THREE.SphereGeometry(1.5, 12, 12);
      const starMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.1, 0.4, starData.brightness),
        transparent: true,
        opacity: 0.9,
      });

      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.copy(starData.position);
      star.userData = { starData };

      const glowGeometry = new THREE.SphereGeometry(3, 12, 12);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.15, 0.6, starData.brightness * 0.4),
        transparent: true,
        opacity: 0.3,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(starData.position);

      starsGroup.add(star);
      starsGroup.add(glow);
    });

    // Add background stars (fewer, more subtle)
    const backgroundStarsGeometry = new THREE.BufferGeometry();
    const backgroundStarsCount = 200;
    const positions = new Float32Array(backgroundStarsCount * 3);

    for (let i = 0; i < backgroundStarsCount; i++) {
      const radius = 150 + Math.random() * 50;
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);
    }

    backgroundStarsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const backgroundStarsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
      transparent: true,
      opacity: 0.4,
    });
    const backgroundStars = new THREE.Points(
      backgroundStarsGeometry,
      backgroundStarsMaterial
    );
    scene.add(backgroundStars);

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // Mouse and touch controls for camera rotation
    let isInteracting = false;
    let previousX = 0;
    let previousY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let rotationX = 0;
    let rotationY = 0;
    let initialDistance = 0;
    let currentDistance = 0;
    let zoom = 1;

    // Mouse event handlers
    const handleMouseDown = (event: MouseEvent) => {
      isInteracting = true;
      previousX = event.clientX;
      previousY = event.clientY;
    };

    const handleMouseUp = () => {
      isInteracting = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isInteracting) {
        const deltaX = event.clientX - previousX;
        const deltaY = event.clientY - previousY;

        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.005;
        targetRotationX = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, targetRotationX)
        );

        previousX = event.clientX;
        previousY = event.clientY;
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (isInteracting) return; // Ignore clicks during drag

      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseRef.current, camera);
      const intersects = raycaster.intersectObjects(
        starsGroup.children.filter(
          (child) => child.userData.starData !== undefined
        )
      );

      if (intersects.length > 0) {
        const clickedStar = intersects[0].object.userData.starData;
        setSelectedStar(clickedStar);
      }
    };

    // Touch event handlers
    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();

      if (event.touches.length === 1) {
        // Single touch - rotation
        isInteracting = true;
        previousX = event.touches[0].clientX;
        previousY = event.touches[0].clientY;
      } else if (event.touches.length === 2) {
        // Two finger touch - zoom
        isInteracting = true;
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        initialDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();

      if (event.touches.length === 1 && isInteracting) {
        // Single touch - rotation
        const deltaX = event.touches[0].clientX - previousX;
        const deltaY = event.touches[0].clientY - previousY;

        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;
        targetRotationX = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, targetRotationX)
        );

        previousX = event.touches[0].clientX;
        previousY = event.touches[0].clientY;
      } else if (event.touches.length === 2) {
        // Two finger touch - zoom
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        currentDistance = Math.sqrt(dx * dx + dy * dy);

        if (initialDistance > 0) {
          const scale = currentDistance / initialDistance;
          zoom = Math.max(0.5, Math.min(3, zoom * (scale > 1 ? 1.01 : 0.99)));
          camera.fov = 75 / zoom;
          camera.updateProjectionMatrix();
        }

        initialDistance = currentDistance;
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      event.preventDefault();

      if (event.touches.length === 0) {
        isInteracting = false;
      } else if (event.touches.length === 1) {
        // Reset to single touch mode
        previousX = event.touches[0].clientX;
        previousY = event.touches[0].clientY;
        initialDistance = 0;
      }

      // Handle tap (touch equivalent of click)
      if (event.changedTouches.length === 1 && !isInteracting) {
        const touch = event.changedTouches[0];
        const rect = renderer.domElement.getBoundingClientRect();
        mouseRef.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y =
          -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseRef.current, camera);
        const intersects = raycaster.intersectObjects(
          starsGroup.children.filter(
            (child) => child.userData.starData !== undefined
          )
        );

        if (intersects.length > 0) {
          const clickedStar = intersects[0].object.userData.starData;
          setSelectedStar(clickedStar);
        }
      }
    };

    // Wheel zoom for desktop
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoom = Math.max(0.5, Math.min(3, zoom + event.deltaY * -0.001));
      camera.fov = 75 / zoom;
      camera.updateProjectionMatrix();
    };

    // Add event listeners for both mouse and touch
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("click", handleClick);
    renderer.domElement.addEventListener("wheel", handleWheel);

    // Touch events
    renderer.domElement.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth camera rotation
      rotationX += (targetRotationX - rotationX) * 0.05;
      rotationY += (targetRotationY - rotationY) * 0.05;

      camera.rotation.x = rotationX;
      camera.rotation.y = rotationY;

      // Gentle twinkling effect for stars
      starsGroup.children.forEach((child, index) => {
        if (child.userData.starData && child instanceof THREE.Mesh) {
          const time = Date.now() * 0.001;
          const twinkle = Math.sin(time + index) * 0.1 + 0.9;
          if (child.material instanceof THREE.Material) {
            child.material.opacity = 0.8 * twinkle;
          }
        }
      });

      // Rotate background stars slowly
      backgroundStars.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.domElement.removeEventListener("wheel", handleWheel);
      renderer.domElement.removeEventListener("touchstart", handleTouchStart);
      renderer.domElement.removeEventListener("touchmove", handleTouchMove);
      renderer.domElement.removeEventListener("touchend", handleTouchEnd);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [starsData]);

  return (
    <>
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100vh", cursor: "grab" }}
      />
      <StarModal star={selectedStar} onClose={() => setSelectedStar(null)} />

      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-4 rounded-lg max-w-xs">
        <h3 className="font-bold mb-2">Night Sky Explorer</h3>
        <p className="text-sm">
          🖱️ Drag to look around
          <br />
          ⭐ Tap/Click the 5 bright stars
          <br />✨ Discover their cosmic stories
        </p>
      </div>
    </>
  );
}
