// // data/types.ts
// import * as THREE from "three";

// export interface ProjectData {
//   id: number;
//   position: THREE.Vector3;
//   name: string;
//   title: string;
//   description: string;
//   content: string;
//   image?: string;
//   song?: string;
//   tags: string[];
//   brightness: number;
//   publishDate: string;
// }

// // data/projects/project1.ts

// export const project1: ProjectData = {
//   id: 1,
//   position: new THREE.Vector3(0, 30, -80),
//   name: "Project 1",
//   title: "Digital Constellation",
//   description:
//     "An interactive exploration of data visualization through celestial metaphors.",
//   content: `
//     <h2>Digital Constellation</h2>
//     <p>This project explores the intersection of data visualization and astronomical beauty. By mapping complex datasets to star patterns, we create intuitive and beautiful representations of information.</p>

//     <h3>Key Features</h3>
//     <ul>
//       <li>Real-time data mapping to celestial coordinates</li>
//       <li>Interactive exploration of multidimensional datasets</li>
//       <li>Beautiful, astronomy-inspired visual design</li>
//       <li>Responsive design for desktop and mobile</li>
//     </ul>

//     <h3>Technical Implementation</h3>
//     <p>Built using Three.js for 3D rendering, D3.js for data processing, and React for component architecture. The system can handle datasets with thousands of data points while maintaining smooth 60fps performance.</p>

//     <h3>Impact</h3>
//     <p>This approach to data visualization has been adopted by several research institutions for presenting complex astronomical data to the public, making scientific information more accessible and engaging.</p>
//   `,
//   image: "/projects/project1/hero.jpg",
//   song: "/projects/project1/ambient-space.mp3",
//   tags: ["Data Visualization", "Three.js", "Astronomy", "Interactive Design"],
//   brightness: 0.9,
//   publishDate: "2024-01-15",
// };

// // data/projects/project2.ts

// export const project2: ProjectData = {
//   id: 2,
//   position: new THREE.Vector3(-50, -20, -70),
//   name: "Project 2",
//   title: "Sonic Landscapes",
//   description:
//     "A generative music platform that creates ambient soundscapes from real-world data.",
//   content: `
//     <h2>Sonic Landscapes</h2>
//     <p>Sonic Landscapes transforms environmental data into beautiful, ever-changing musical compositions. Weather patterns, seismic activity, and ocean currents become the instruments in an endless symphony.</p>

//     <h3>Creative Process</h3>
//     <p>The project began with a simple question: what if we could hear the Earth's heartbeat? By sonifying environmental data streams, we create music that reflects the planet's natural rhythms.</p>

//     <h3>Technology Stack</h3>
//     <ul>
//       <li>Web Audio API for real-time audio synthesis</li>
//       <li>WebGL shaders for visual representations</li>
//       <li>Real-time data feeds from weather and seismic APIs</li>
//       <li>Custom algorithmic composition engine</li>
//     </ul>

//     <h3>Exhibition History</h3>
//     <p>Featured in digital art galleries worldwide, including the Museum of Digital Arts in London and the Interactive Media Festival in Tokyo. The piece has been running continuously for over 800 days, never repeating the same composition twice.</p>
//   `,
//   image: "/projects/project2/hero.jpg",
//   song: "/projects/project2/generative-ambient.mp3",
//   tags: [
//     "Generative Music",
//     "Data Sonification",
//     "Web Audio",
//     "Environmental Data",
//   ],
//   brightness: 1.0,
//   publishDate: "2024-02-28",
// };

// // data/projects/project3.ts

// export const project3: ProjectData = {
//   id: 3,
//   position: new THREE.Vector3(55, -15, -75),
//   name: "Project 3",
//   title: "Memory Palace VR",
//   description:
//     "A virtual reality experience that helps users build and navigate digital memory palaces.",
//   content: `
//     <h2>Memory Palace VR</h2>
//     <p>Based on the ancient Greek method of loci, Memory Palace VR creates immersive 3D spaces where users can store, organize, and retrieve memories and information using spatial navigation.</p>

//     <h3>The Ancient Technique, Digitized</h3>
//     <p>Memory palaces have been used for over 2,500 years by orators, scholars, and memory champions. Our VR implementation makes this powerful technique accessible to everyone, with guided tutorials and customizable environments.</p>

//     <h3>User Experience Design</h3>
//     <ul>
//       <li>Intuitive hand tracking for object placement</li>
//       <li>Multiple environment templates (library, garden, castle)</li>
//       <li>Progressive difficulty system</li>
//       <li>Social sharing of memory palaces</li>
//     </ul>

//     <h3>Research Collaboration</h3>
//     <p>Developed in partnership with cognitive psychology researchers at Stanford University. Initial studies show 340% improvement in memory retention compared to traditional note-taking methods.</p>

//     <h3>Future Development</h3>
//     <p>Planned features include AI-assisted palace generation, multiplayer collaborative spaces, and integration with educational platforms.</p>
//   `,
//   image: "/projects/project3/hero.jpg",
//   tags: [
//     "Virtual Reality",
//     "Memory Techniques",
//     "Education",
//     "Cognitive Psychology",
//   ],
//   brightness: 0.85,
//   publishDate: "2024-03-10",
// };

// // data/projects/project4.ts

// export const project4: ProjectData = {
//   id: 4,
//   position: new THREE.Vector3(-30, 0, -85),
//   name: "Project 4",
//   title: "Blockchain Ecosystem",
//   description:
//     "A decentralized platform for creative collaboration and digital asset management.",
//   content: `
//     <h2>Blockchain Ecosystem</h2>
//     <p>A comprehensive platform that enables artists, musicians, and creators to collaborate, share ownership, and monetize their work through blockchain technology, smart contracts, and NFTs.</p>

//     <h3>Decentralized Collaboration</h3>
//     <p>Traditional creative industries often involve complex intermediaries and unclear ownership structures. Our platform uses smart contracts to automatically distribute royalties, track contributions, and ensure fair compensation for all collaborators.</p>

//     <h3>Core Features</h3>
//     <ul>
//       <li>Multi-signature wallets for project funding</li>
//       <li>Automated royalty distribution</li>
//       <li>Version control for creative assets</li>
//       <li>Decentralized file storage (IPFS)</li>
//       <li>Cross-chain compatibility</li>
//     </ul>

//     <h3>Environmental Responsibility</h3>
//     <p>Built on Polygon's proof-of-stake network, reducing energy consumption by 99.9% compared to proof-of-work systems. Carbon-negative operations through verified offset programs.</p>

//     <h3>Community Impact</h3>
//     <p>Over 2,500 artists have joined the platform, creating more than $1.2M in creator revenue. Featured partnerships with indie record labels and digital art collectives worldwide.</p>
//   `,
//   image: "/projects/project4/hero.jpg",
//   song: "/projects/project4/electronic-beats.mp3",
//   tags: [
//     "Blockchain",
//     "Smart Contracts",
//     "Creator Economy",
//     "Decentralization",
//   ],
//   brightness: 0.8,
//   publishDate: "2024-04-22",
// };

// // data/projects/project5.ts

// export const project5: ProjectData = {
//   id: 5,
//   position: new THREE.Vector3(40, 10, -80),
//   name: "Project 5",
//   title: "Neural Garden",
//   description:
//     "An AI-powered installation that grows digital plants based on human emotional input.",
//   content: `
//     <h2>Neural Garden</h2>
//     <p>Neural Garden is an interactive installation where artificial neural networks learn from human emotions to grow unique digital ecosystems. Each visitor's emotional state contributes to the garden's evolution, creating a living artwork that reflects our collective human experience.</p>

//     <h3>Emotion Recognition Technology</h3>
//     <p>Using advanced computer vision and physiological sensors, the system detects micro-expressions, heart rate variability, and skin conductance to understand visitors' emotional states without invasive monitoring.</p>

//     <h3>Generative Ecosystem</h3>
//     <ul>
//       <li>ML-driven plant generation based on emotional patterns</li>
//       <li>Seasonal cycles influenced by visitor demographics</li>
//       <li>Symbiotic relationships between digital organisms</li>
//       <li>Real-time ecosystem balance and adaptation</li>
//     </ul>

//     <h3>Philosophical Framework</h3>
//     <p>The project explores questions about artificial life, collective consciousness, and the relationship between human emotion and natural growth. Each digital plant species represents different emotional archetypes discovered through machine learning.</p>

//     <h3>Technical Innovation</h3>
//     <p>Custom-trained transformer models process emotional data streams in real-time, while procedural generation algorithms create unique plant morphologies. The system runs on a distributed computing cluster, handling thousands of simultaneous emotional inputs.</p>

//     <h3>Exhibition Highlights</h3>
//     <p>Permanent installation at the Digital Arts Museum in Seoul. Temporary exhibitions at Ars Electronica, SIGGRAPH, and the Venice Architecture Biennale. Over 50,000 visitors have contributed to the garden's growth.</p>
//   `,
//   image: "/projects/project5/hero.jpg",
//   song: "/projects/project5/organic-ambient.mp3",
//   tags: [
//     "Machine Learning",
//     "Generative Art",
//     "Emotion Recognition",
//     "Interactive Installation",
//   ],
//   brightness: 0.9,
//   publishDate: "2024-05-30",
// };

// // data/projects/index.ts
// export { project1 } from "./project1";
// export { project2 } from "./project2";
// export { project3 } from "./project3";
// export { project4 } from "./project4";
// export { project5 } from "./project5";

// export * from "../types";
