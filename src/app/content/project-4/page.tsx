"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { projectSearchData } from "../projectSearchData";
import MusicPlayer from "@/components/MusicPlayer";

import UnlockButton from "@/components/UnlockButton";

export default function PasswordGate() {
  const project = projectSearchData.find((p) => p.id === 4);

  const PASSWORD = "FADE";

  const [values, setValues] = useState<string[]>(
    Array(PASSWORD.length).fill("")
  );
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Check if session already authorized
  // useEffect(() => {
  //   const alreadyAuthorized = sessionStorage.getItem("authorized") === "true";
  //   if (alreadyAuthorized) {
  //     setIsAuthorized(true);
  //   } else {
  //     inputsRef.current[0]?.focus();
  //   }
  // }, []);

  useEffect(() => {
    if (!isAuthorized) {
      const timer = setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 50); // small delay so input is rendered
      return () => clearTimeout(timer);
    }
  }, [isAuthorized]);

  const resetInputs = () => {
    setValues(Array(PASSWORD.length).fill(""));
    inputsRef.current[0]?.focus();
  };
  const handleChange = (index: number, raw: string) => {
    if (!/^[a-zA-Z]?$/.test(raw)) return; // only letters or empty
    const val = raw.toUpperCase();
    const next = [...values];
    next[index] = val;
    setValues(next);

    // Clear error state when typing again
    if (error) setError("");

    // Move to the next box if a character was typed
    if (val && index < PASSWORD.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (values[index]) {
        const next = [...values];
        next[index] = "";
        setValues(next);
        if (error) setError(""); // clear error if editing
        e.preventDefault();
        return;
      }
      if (index > 0) {
        const next = [...values];
        next[index - 1] = "";
        setValues(next);
        inputsRef.current[index - 1]?.focus();
        if (error) setError(""); // clear error if editing
        e.preventDefault();
        return;
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
      e.preventDefault();
    }
    if (e.key === "ArrowRight" && index < PASSWORD.length - 1) {
      inputsRef.current[index + 1]?.focus();
      e.preventDefault();
    }

    // Press Enter = try unlock
    if (e.key === "Enter") {
      handleUnlock();
    }
  };
  const setInputRef = (i: number) => (el: HTMLInputElement | null) => {
    inputsRef.current[i] = el;
  };
  const handleUnlock = () => {
    const joined = values.join("");
    if (joined === PASSWORD) {
      setIsAuthorized(true);
      setError("");
      sessionStorage.setItem("authorized", "true"); // ✅ remember in this session
    } else {
      setError("Incorrect password");
      setShake(true);
      setTimeout(() => setShake(false), 400); // reset shake after animation
      setTimeout(() => resetInputs(), 900); // clear inputs after short delay
    }
  };
  if (isAuthorized) {
    return (
      <motion.div
        className="h-full"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <>
          <div className="z-[99] bg-white">
            <div
              key={project?.id}
              style={{ backgroundColor: project?.color }}
              className=" font-bold text-white py-1 px-2 flex justify-between items-center"
            >
              <p>{project?.tags}</p>
              <p className="font-medium text-sm">[23.04_3M]</p>
            </div>

            <p className="text-xs mt-1 mb-2">
              Beginner Friendly{" "}
              <span className="py-0.5 px-1 rounded-md bg-slate-200 text-slate-600 ">
                Lmao forget about it
              </span>
            </p>
            <MusicPlayer src="/audio/Moon Halo.mp3" />
            <div className="flex flex-col items-end">
              <button className="cursor-not-allowed px-4 py-1.5 font-medium text-gray-700 border border-brand bg-gray-200 text-sm mr-1  w-fit transition-all shadow-[3px_3px_0px_#1D1B1C] ">
                Translate to Vietnamese
              </button>
            </div>
          </div>
          <div className="max-w-full relative text-[#292326] mt-2 p-3 border-l-2 border-y-2 md:border-2 border-gray-200 ">
            <p className="text-gray-800 p-4 bg-brand-quote-bg/8 italic rounded mb-4">
              … <br />
              Eden: Miss Raiden, you should have looked up to the starry night
              sky sometimes, right? <br />
              Mei: Yes, only less and less. <br />
              Eden: Ah... I can relate to that. Watching the stars... Requires
              suitable companions. But when we look up to the stars, they're not
              there anymore. Most of them have long perished... The light our
              eyes catch is from tens of thousands of years ago. But still, this
              never diminishes their brilliance....
            </p>
            <p>
              This is probably the hardest game to write about, it's been years
              since I finished it, and I wonder whether I can retain the
              knowledge, emotion and impression accurately enough or the
              impression holds enough weight to leave a faithful and authentic
              'review'? Or shouldn’t I hold that standard and just write what I
              feel at the present moment?
              <br />
              <br /> Time passed, impression changed, discovering more layers
              while forgetting some. Some stay and stick well, some become fuzzy
              and harder to recollect. It feels somewhat a bit less authentic to
              sit on it too long and write about the stuff I don’t vividly
              remember. <br />
              <br />I started writing this as a regular review, but after weeks
              of constant revisions, this game deserves something a little bit
              different.
              <br />
              <br />
              Because it’s a gatcha game, the playing experience is different{" "}
              <br />
              Because it’a a gatcha game, you can’t really play freely whenever
              you want, but only bit by bit everyday
              <br />
              Because it’s a gatcha game, you are restrained to it’s limiting
              design philosophy and are forced to manuvour around it little by
              little
              <br />
              Because it’s a gatcha game, you have to make all sort of
              compromise to sit down and enjoy it.
              <br />
              Because it’s a gatcha game, somehow … the impression is much much
              more powerful.
            </p>
            <hr className="my-4" />
            <p>
              Mihoyo, around this time, they are huge, you can’t fathom their
              influence, and the money they are making through this deceptive
              gambling gatcha system. Who knows what you will change when “you”
              read this? Maybe they fall from grace? Is the company finally
              public? The next EA and Blizzard, or still just a Chinese gaming
              company that happens to know exactly what appeals to the masses.
              <br />
              <br />
              But let’s step back for a bit, to a more peaceful time, where they
              created this game that deserved a spot here. Did this game give
              birth to this specific project idea and shape its concept to begin
              with? Maybe.
              <br />
              <br /> It was the time when you felt the company prioritized
              passion and love, rather than market trends and what work for the
              masses. People in charge care, sprinkle their effort even in
              trivial things such as maintenance messages, mailbox letters,
              characters’ birthday CG,... they were brimming with love.
              <br />
              <br /> The cheesy dialogue they wrote, the clumsy art they drew
              that heavily depends on 3D modelling, the songs they composed,
              everything was so … raw and human, we had work of art, compare to
              glorified promotional materials.
              <br />
              <br /> Honkai Impact 3rd. So what even is the Honkai? Honkai is
              something that grows along with civilization, the more advanced
              the civilization, the stronger the honkai becomes. No one knows
              where it comes from, to what extent it will stop, but it seems to
              do one thing only, to destroy mankind… I think? The concept lost
              its meaning ages ago, even in-game, and even more when it was
              slapped on many different games with no substance behind it.{" "}
              <br />
              <br />
              The setting of Honkai Impact 3rd couldn't be simpler: cute girls
              fighting monsters. Like every shounen story there is, they learn
              about fighting for something other than themselves, about the cost
              of sacrifice, about choosing to live on for the sake of others.
              They learn to fight and to protect, they grow, mature and finally
              graduate.
            </p>
            <hr className="my-4" />
            <p>
              This is a gatcha game, most gamers would be very familiar with
              this type of game and its live service nature.
              <br />
              <br /> With every gatcha game, the end experience is similar to
              burning out, whether you notice an aggressive monetary strategy
              from the company or making decisions that clearly focus on
              squeezing money out of your pocket rather than the playing
              experience. Gradually, the grinding makes you sick, the constant
              loop of chasing new content and flashy characters tires you out,
              and it ends in resentment. <br />
              <br />
              But this is the first time I treated it like a console game, meta,
              powercreep, grinding, limited events, daily log-in, these things
              are just secondary. Literally didn’t give a shit about a game mode
              just because it doesn’t follow the chronological story order. The
              story comes first, and when it’s finished, I close it, like
              closing a book.
            </p>
            <hr className="my-4" />
            <p className="underline uppercase text-lg font-bold my-4">STORY</p>
            <p className="text-gray-800 p-4 bg-brand-quote-bg/8 italic rounded mb-4">
              "At that time, I finally realized.. we could experience so much
              more than just fighting! Those experiences became a new driving
              force for my Valkyrie career. That's the reason why I want to
              create a different branch. I want to give those students something
              I almost missed. <br /> <br />A room with privacy, a beautiful
              garden, a delicious school cafeteria, lessons, activities, friends
              who you can skip school with together... I want them to experience
              the world freely as a person first. I want them to have their own
              lives, a life that has nothing to do with their career or
              responsibilities, a life where they can wholeheartedly make
              themselves happier. <br />
              <br />
              Even as Valkyrie, I want them to see things for themselves,
              experience the world at their own pace. I hope that one day they
              will be able to decide their own destiny and choose what they want
              to protect. I hope they will have beautiful memories in mind when
              they cry out "Fight for all that's beautiful in the world". I hope
              they truly understand what that means."
            </p>
            <p>
              Gatcha games’ story is usually not the best. <br />
              <br />
              Some are planned out to be dragged due to the live service model
              and how the game is designed, when the constant quality stories
              are expected to be published every patch instead of a concise
              self-contained narrative. The story is segmented into multiple
              small fights, reading and bombastic combat can break the
              narrative’s flow. Some stories revolved around a continuously
              introduced cast, the story only takes the back seat, serving as a
              setting and device to introduce flashy characters constantly.{" "}
              <br />
              <br />
              Honkai Impact 3rd is one of the cases where such criticism doesn’t
              hold weight. The story feels planned out, while rocky during the
              first period, the team had vision and made the story the forefront
              aspect of the game. One OG Mihoyo fan told me, the dark,
              uncomfortable theme hidden underneath the inviting surface is
              their iconic style. <br />
              <br />
              The game also chooses to stick with a smaller cast, a close-knit
              group of people, the cast feels like a group of close friends, a
              small family where you feel the connection and relationship. They
              don’t feel like they were created to sell, to fit a concept just
              to get left collecting dust after several patches.
              <br />
              <br /> Despite the apocalyptic setting and implications about
              death and sacrifice, it's a story about hope. About pushing
              through and reaching the light from the other side, there is
              always someone to look over and support you now and there will
              also be someone waiting for you. <br />
              <br />
              Tragedy isn’t the end, it’s the beginning of hope. <br />
              <br />
              Eventually, you will set on a path no one has ever walked on, pave
              a new way for the future. Everyone is here, they support and are
              willing to sacrifice themselves for you, no matter what, you won’t
              be alone. <br />
              <br />
              If you think deeper about the story, it’s fine, it’s okay, it’s
              not gonna break any ground. There is a lack of nuances, deeper
              psychological explorations, not enough weight in the core threat,
              not to mention retcons sprinkled throughout, and a new narrative
              that seems to come out of nowhere. The me now might not give the
              game the same patience and leeway now. But judging from the
              standard of mobile games during that era 2016~ish, this game might
              sit at the very top. <br />
              <br />
              But these criticisms don’t diminish the charm, do they? A classic
              shounen that set out to do exactly what it claims to do, it’s
              indeed what Mihoyo wants to tell, and this story will literally
              shit on top of Genshin or Star Rail stories. Character focus, they
              are charming and have chemistry, old people are mature, they feel
              intelligent, they can think, they aren’t created to have an
              appealing personality to sell you right away.
            </p>
            <p className="text-gray-800 p-4 bg-brand-quote-bg/8 italic rounded my-4">
              "At the time, you brought me the light of hope, and made me
              believe things would get better. <br />
              <br /> But I was wrong. I survived, as a target of resentment.{" "}
              <br />
              All the kids in the neighborhood went to the same school, they all
              died except me. <br />
              All families in the neighborhood lost their loved ones in that
              disaster except mine. They shared the pain and helped one another,
              excluding my parents."
            </p>
            <hr className="my-4" />
            <p className="underline uppercase text-lg font-bold my-4">
              ANIMATED SHORT
            </p>
            <p>
              Animated shorts are one of the best things that come out of the
              game. After finishing certain milestones and overtime many
              chapters, you, the players, are rewarded with a gorgeous cutscene.
              <br />
              <br />
              They stand among the most viewed videos on the Youtube channel,
              promotional materials from a marketing standpoint, but their
              weight is much more than glorified promotional videos, there is
              another side of passion and love that doesn’t feel they are
              intended for profit. <br />
              <br />
              Elevate the story's tension point, drive emotional impact, create
              a resonant impression... Every single animation is crafted with
              care in terms of production, storytelling, voice acting and songs,
              they are proud works of art.
              <br />
              <br />
              I visited the song before embarking on this journey of playing,
              and I wondered if this is a music company that happens to make
              games. They deserve to sit on the peak of the IP with how much
              they invested in the quality and how much they showed appreciation
              and connection to the players. I still remember the excitement of
              waiting for the final animated short, even though it was the last
              one.
              <br />
              <br />
              One day in the far future, I would love to watch all the classics
              again: Befall, Shattered Samsara, Everlasting Flame, Thus Spoke
              Apocalypse, Because of You, Graduation Trip. Once again, immerse
              myself in the detail, the music, remind myself of the stories that
              I hold so dear to heart. Maybe I won’t feel anything by then,
              maybe I will see the same charm and shed a subtle smile, maybe I
              will get reminded of something I missed and see a different layer.
              Another thing added to the list before dying.
            </p>
            <hr className="my-4" />
            <p className="underline uppercase text-lg font-bold my-4">
              For Kiana{" "}
            </p>
            <div>
              For Kiana, you always default to carrying the burden on your own,
              willing to die for something greater than yourself. You lied to
              Mei despite losing your sense of taste, trying to force a smile
              through everything because you think that’s what heroes should do.
              But you can’t always act like so, because you once pointed the gun
              at your chin, ready to say goodbye to everything. You have your
              own guilt you can’t overcome, you can’t accept that someone died
              for you.
              <br /> <br />
              No matter what, you are always the first one to take action, to
              the point that your loved one has to beat you up to save you. But
              you grow, with friends and important people alongside you, you
              learn, and you understand the price of sacrifice. But after the
              rain, sunshine awaits, right? People love you, they believe and
              trust you, they want to see you live on, you become the brightest
              flame there is and guide everyone forward. You are a beacon of
              hope and dream, you are the hero.
              <br />
              <p className="text-gray-800 p-4 bg-brand-quote-bg/8 italic rounded my-4">
                “Turn into a moon that tells the warmth and brightness of the
                sun” <br />
                <br />
                "Though you're willing to die for this world, there will
                eventually be someone who treasures you more than this world.”
              </p>
              <p> Why do I have a soft spot for the protagonist?</p>
            </div>
            <hr className="my-4" />
            <p className="underline uppercase text-lg font-bold my-4">
              For Elysia
            </p>
            <p className="text-gray-800 p-4 bg-brand-quote-bg/8 italic rounded my-4">
              "He fell from the sky that day. The people on the ground looked up
              and thus saw a starry night sky. The moon and the stars sent God's
              daughter, and she was willing to be human's companion. The winds
              morphed into her chariot, the seas turned into her garden plots.
              Birds brought sown seeds, bountiful flowers waves the anthem of
              love. She descended upon the world like that, travelling the
              world, growing together with humans, nurturing together with the
              world."
            </p>
            <p>
              Hi ♪~ <br />
              You heard a voice.
              <br />
              She greeted and welcomed you with such enthusiasm, even though you
              had just met.
              <br />
              <br />
              You couldn’t really tell what she was thinking, you couldn’t
              really read this girl. Naturally, you were wary of her, no one
              could be this earnest, or rather, act this earnest.
              <br />
              <br />
              She insisted on guiding you through the Realm, supported and
              answered your questions along the way.
              <br />
              <br />
              What’s with this pink color everywhere? It’s overwhelming, because
              it’s cute? she said…
              <br />
              You paid no mind, after all, a quest was waiting for you as usual.
              <br />
              <br />
              You progressed, you met more people, more members in the Realm.
              <br />
              They were kinda weird people, but heroes as you were described.
              <br />
              <br />
              You learned more about them, they spoke in riddles, they gave you
              more questions than answers, but each interaction was kinda
              interesting, you could feel their personality, their story and
              interaction every time you met them, they didn’t seem like bad
              people, just people with flaws, with unfinished story wanting to
              guide you in their own way.
              <br />
              <br />
              It seemed like the girl you met at the start was quite popular,
              because people referred back to her a lot, some praised her, some
              told you they were her best friend, some spoke in riddles again,
              and some straight up didn’t give you anything but another side
              quest. Okay, more pieces of a puzzle then.
              <br />
              <br />
              More pieces of information pointed to her, just when you thought
              you could trust and understand her a bit more, you find another
              lore drop that contradicts your understanding. Lowered your guard
              for this? Back to square one you went.
              <br />
              <br />
              Hold on, why should you care about her? She is a willful and
              egocentric girl. Did you actually feel disappointed when you
              didn't know her enough? And why did she still shed the smile and
              give you the same affection?
              <br />
              <br />
              But to all the people here, these so-called heroes, there was
              absolutely no lingering doubt, everything she ever did, is
              wholeheartedly, everything she has ever done, is genuine.
              <br />
              <br />
              She challenged you, but never to stand in your way.
              <br />
              She gave you riddles, but never meant to confuse you.
              <br />
              <br />
              She was always there when you needed her for some reason, sitting
              in the Realm to welcome you back, checking on you from time to
              time, always so cheerful, always so full of life. When will this
              act drop? You asked. Or are you slowly looking forward to seeing
              her already? Or does the fact that you notice she was there when
              you wanted to see her already hint at something?
              <br />
              <br />
              Back and forth banters, trade for mutual benefits, with her help,
              you explored and gained more understanding about the Realm and all
              the tragic people here, how they came together under her, and she
              was the glue that held them together.
              <br />
              <br />
              Overcame the final challenge, unpacked another layer of mystery,
              you found something that no other visitors or the other members
              have yet unveiled. You reach the closest to the truth, earn
              everyone's respect and trust, and thus you can now learn about her
              story, her true story.
              <br />
              <br />
              There was a time when she was also pure and naive, full of
              curiosity like a sprout waiting to bloom. A child raised by kind
              people, she eventually wanted to leave the village, to walk, to
              look to travel everywhere, "to be like the protagonist in the
              picture book, and look for paradise at the end of the world!"
              <br />
              <br />
              Perhaps she naturally wanted to follow her dream in fairy tales,
              perhaps she felt something when many shady people came to visit
              the village, but she knew she had to leave sooner or later.
              <br />
              <br />
              She travelled past cities, mountains, villages, the wilds.
              <br />
              Shared a bread with an old man in a ruined church
              <br />
              Traded an orange with another unfortunate child, get betrayed
              <br />
              Learned about music, archery from kind hearted people
              <br />
              Saw homeless children lamenting on the street in the rain, crying
              for food
              <br />
              Saw fortunate children could smile and attend school
              <br />
              Witnessed art, a privileged form of entertainment, witnessed
              people get their body parts cut off in harrowing rituals…
              <br />
              <br />
              She felt kindness, people who welcomed, encouraged, and helped her
              along the way.
              <br />
              She felt malice, people who betrayed, framed, and deceived her.
              <br />
              <br />
              Seeing the world with her own two eyes, there was no paradise in
              this world, and she wanted to create one herself.
              <br />
              <br />
              Eventually, she joined the MOTHs, joined the forefront to fight
              for humanity, founded the FlameChaser and fought the Honkai
              alongside these people.
              <br />
              They fought for a better outcome, a better future, and she still
              held the wish to reach the paradise where people know about joy
              and laughter.
              <br />
              <br />
              In the dying world, she became a shining hope that pushes people
              forward. In this wretched world that had no hope to overcome the
              Honkai, slowly rotten to nothingness, she still smiled, she fought
              and she loved, wholeheartedly.
            </p>
            {/* <hr className="my-4" /> */}
            <p className="text-gray-800 p-4 bg-brand-quote-bg/8 italic rounded my-4">
              "What's the first thing that comes to your mind when you think of
              our era and the MOTHs? Smoke and fire? Scorched earth and broken
              walls? Blood and death? Everyone has this impression, but it's
              wrong. When our world was dying, people were still living their
              normal lives day to day, thinking about tomorrow's breakfast.
              People were still talking about plans and dreams that would take
              years to fulfill. Even on the last day, people were still hopeful
              for a brighter future. Even when civilization was crumbling, there
              was still light coming out from the cracks."
            </p>
            <p>
              In that era, Herrschers were bound to be humanity’s greatest enemy
              <br />
              <br />
              Elyisa, the 2nd of the Flamechaser, the bearer of the Signet of
              Ego, the girl who deeply loves humanity … was a Herrscher. <br />
              <br />
              This world was slowly turning to dust. The last Herrscher struck,
              killing the remaining big cities and wiping out innocent people
              alongside them. Another one was about to descend soon to deal one
              final blow, putting an end to everything for good.
              <br />
              <br />
              Hersscher, the concept that humanity despises.
              <br />
              Elysia, is a Herrscher.
              <br />
              <br />
              People in chaos, fear, despair, the remnants of humanity were
              tearing each other apart, combined with the fact she was also
              under suspicion, this was the worst outcome. In her final attempt
              to express her love, she put on an act and volunteered to become
              the 13th Herrscher, standing against humanity to unite everyone
              one more time.
              <br />
              <br />
              By sacrificing herself, she could go back to the Honkai to alter
              the source, for a chance for the next generation, the next era,
              the next Herrschers, could retain their humanity, for the future
              to have a better chance at overcoming the Honkai.
              <br />
              <br />
              She was prepared to leave this world, wearing the title that
              stands against humanity, rather than seeing everything she loves
              turn into nothingness.
              <br />
              The final banquet she wanted, the final send-off she prepared
              <br />
              <br />
              The remaining members, those who left the banquet, refused to
              fight because they believed in her, and those who attended the
              banquet because they believed in her.
              <br />
              <br />
              To everyone else, she is just another threat that needs to go,
              another Herrscher that needs to be eliminated. To the Flamchasers,
              she is … another human.
              <br />
              <br />
            </p>
            <p className="text-gray-800 p-4 bg-brand-quote-bg/8 italic rounded mb-4">
              But all performances must come to an end, right? So now, let's put
              a beautiful end to it. If, in the distant future, you all meet a
              Herrscher like me...
              <br />
              You must find a way to tell me. I'll be... really happy if you do!
              <br />
              Because I'll know that from now on, nobody will have to face such
              a difficult decision anymore.
              <br />
              Because I'll know that our footprints will someday guide someone
              else forward.
              <br />
              Tragedy isn't the end. It's the beginning of hope.
              <br />
              Only humanity could think like that. And only humanity could try
              to realize such a conviction.
              <br />
              So, please tell me. At the end of this story… did I.. become
              human?
              <br />
              <br />
              "Tonight, there is no Herrscher here."
              <br />
              "Because she who slumbers here and sings to the future generations
              is the MOTHs' honorable and proud warrior, the founder of the
              Thirteen Flame-Chasers..."
              <br />
              "The pristine human, Elysia."
              <br />
              <br />
              “Thank you”. The one on the stage said.
              <br />
              <br />
              Finally, it's time to say goodbye...
              <br />
              Because I am a Herrscher, so perhaps, I might be able to do it.
              <br />
              But because I am human, I can definitely do it.
              <br />
              Now, my friends, my confidants, my dearest comrades...
              <br />
              Elysia's curtain call must be brilliant and beautiful so... please
              see me off one last time
            </p>
            <p>...Herrscher of Human...</p>
            <hr className="my-4" />
            <p>
              Her love, is weird, her love, is not realistic… is it?
              <br />
              <br />
              It doesn’t have enough nuances, it doesn’t feel right in a
              real-life context, it doesn’t have enough exploration and weight
              to really sell the feeling, not without the long and treacherous
              journey one usually has to overcome.
              <br />
              <br />
              Perhaps her existence that was not supposed to be that makes her
              love so... wrong, because she is not a human, and that what makes
              her love so unique, so special <br />
              <br />
              But would she wish for one day, humans can love each other, like
              how she truly loves them? … There is only one answer…
              <br />
              <br />
            </p>
            <p className="text-gray-800 p-4 bg-brand-quote-bg/8 italic mb-4 rounded">
              “Because her love is so pure, she cannot exist in the real world.”
            </p>
            <p>
              There are times when the love is so overwhelming that it overrides
              your rational mind.
              <br />
              Th ere are times when the love is so strong that you want it to
              override your rationality.
              <br />
              You dislike everything, you find it hard to accept yourself
              <br />
              You see everything is ugly, you see it impossible to love
              <br />
              And yet you see someone wish the best for it, such a difference
              that it renders everything wrong
              <br />
              <br />
              That love…
              <br />
              It was bright, unlike your gloomy self
              <br />
              It was pink, unlike how colorless you see everything.
              <br />
              It was wrong, like you deem it should be.
              <br />
              <br />
              You can’t really take your mind off it, would it be easier to just
              brush it off?
              <br />
              <br />
              What you want to hear, what you want to feel at the moment, is
              this another quest to find the nuances?Another complexity that
              requires energy and patience, to constantly confront and question,
              digging deeper again and again.
              <br />
              <br />
              Love, hope, how childish, how indulging…
              <br />
              But is it enough to let you walk one step forward?
              <br />
              <br />
              Appeal to emotion momentarily, not very realistic, just some
              wishful thinking….
              <br />
              But is it enough to make you feel something again?
              <br />
              <br />
              Before the dawn of tomorrow arrives and you once again have to
              wake up, would you want to let yourself be embraced by love in
              this fleeting moment?
            </p>
            <hr className="my-4" />
            <p>
              This world is doomed, but her love gives them reason to fight. The
              world is doomed, but her love gives birth to a brighter distant
              future.
              <br />
              <br />
              Everything now makes sense to you, her previous actions, her
              words,... The person you were once wary of, you once distrusted.
              <br />
              <br />
              Was there a ‘click’ moment when you were aware of everything? or
              ever since the start you want to believe this to happen?
              <br />
              <br />
              The initial judgement you cling to now has transformed into
              something different, your heart unfolded before her and now
              carries understanding and respect, and slowly found its way to
              love.
              <br />
              <br />
              At the end of the journey, I found myself in a situation
              contrasted to the beginning.
              <br />
              <br />
              I was not ready to leave, did not want to, there is no other quest
              or nothing else I would rather do. I didn’t want to say goodbye to
              her or any other members. I chose “No…”, made the same choice
              repeatedly that night. Was it an attempt to make up for all the
              distrust before? Was it okay to not be ready?
              <br />
              <br />
              … Rode the train one last time, saw the hidden CG, looked at
              everyone one last time before moving forward.
              <br />
              <br />
              The final send-off.
              <br />
              <br />
              The Elysian Realm ... is no more.
            </p>
            <hr className="my-4" />
            <p>
              Words can’t describe how much I desire to see, or rather, I want
              her to see the paradise on Earth she wished so dearly for.
              <br />
              <br />
              The world where humans aren’t always on the edge, struggling for
              their survival, the world where humans have more freedom than
              ever, living their own life, making their own choices, talking
              about everyday mundane things, messing around, smiling together,
              people thrive, help each other, and spread even more love.
              <br />
              <br />
              Words can’t describe the absolute joy I felt when seeing her as a
              conductor at the end of the Dreamy Euphony concert, she danced
              with everyone, singing “Moon Halo”. Did her wish come true at this
              moment? Did she manage to see this new world she helped to shape,
              and see everyone’s stories come together at this moment of love
              and passion, something she would sincerely want at the bottom of
              her heart?
              <br />
              <br />
              Would I be able to influence others like her? Would I be able to
              spread love and be as compassionate as her? Eventually it got me
              wondering, if the world could possibly turn out like that…? Or
              will it only exist inside my mind, never ‘real’ and forever
              trapped in a fictional world. The answer….
              <br />
              <br />
              There will never be a paradise on Earth. I can’t make a paradise,
              and I don’t believe it can ever exist
              <br />
              ……………
              <br />
              ………
              <br />
              ……
              <br />
              …<br />
              ..
              <br />
              .<br />
              But why does my heart sting knowing the fact that it will never
              be?
              <br />
              <br />
              I wonder if I hear her voice again in the distant future, when I
              forget, and lose my way, would I shed tears?
              <br />
              <br />
              Do I have enough love and compassion? Can I carry her image and
              spread love to others just like her? Or live to the fullest and
              share my luck I have with others? Can I just try to simply make
              life a bit better for those around me? Or at least, to those I
              care about?
              <br />
              <br />
              … I don’t know, it’s hard at every step along the way.
              <br />
              <br />
              People said you can enjoy a fictional character for several
              reasons, one of which is that you see something you don’t have in
              that character.
              <br />
              <br />
              Life is not always rainbows and sunshine, compassion works
              differently here, people are a lot more ugly, yet at the same time
              can be a lot more beautiful. Maybe deep down in my heart, when the
              time comes to make the difficult choice, maybe I can try to
              remember her, maybe try to lean on the side of love, and just
              maybe ... not contributing to burning this world. I will likely
              mess up and stumble along the way, but right now, I want to say
              until my final breath that I will try.
            </p>
            <p className="text-gray-800 p-4 bg-brand-quote-bg/8 italic my-4 rounded">
              These memories we share will never disappear. The feeling left
              between us will never disappear. They will become irremovable
              marks on my body. Through me, they will extend on and on into the
              future. I will be proof that all of you existed. I will be ...
              proof that all of you exist forever.
            </p>{" "}
            <p className="text-gray-800 p-4 bg-brand-quote-bg/8 italic mb-4 rounded">
              "And now, the end is near
              <br />
              And now, it's time to return
              <br />
              Farewell, beautiful world
              <br />
              From now on, the stars will shine, for I have been here before.
              <br />
              From now on, the flowers will bloom, for I have never left.
              <br />
              Please transform my arrow, my flower, and my love into a seed and
              bring it to the wilting earth.
              <br />
              Then, let it blossom into an eternal and pristine... Flower of
              humanity.
              <br />
              My name is Elysia....
              <br />
              The very first Herrscher, Herrscher of Human"
            </p>
            <p className="text-right"> There will never be another Elysia</p>
            <hr className="my-4" />
            <p className="underline uppercase text-lg font-bold my-4">
              End note
            </p>
            <p>
              2 years later, part of me still ‘clings’ to this game and the
              experience around it. I enjoy listening to their music, sometimes
              when it gets old, I switch to instrumental or cover but they are
              still a big part of the playlist. Part of me says it doesn’t want
              to forget about the story at all, because it feels like rejecting
              the existence.
              <br />
              <br />
              The beginner-friendly banner with Flamescion and Senti. The free
              Miss Pink Elf I chose, not having a care in the world about meta.
              The atrocious UI. The time-gated event requires previous chapter
              understanding. The birthday event cutscene for a character that
              won’t appear until much later. The missing CG that I experienced
              at the beginning results in an incomprehensible narrative. The
              subreddit and guide I read to get ahead of the game schedule,
              looking up rerun banners to plan my saving.
              <br />
              <br />
              The group chat with constant memes and updates, praising the game
              while shitting on the company. The routine of playing at night
              after finishing work.
              <br />
              <br />
              If only I can continue, continue to see the story of the trio with
              Kiana messing around, Fuhua and Senti dynamic, everyone dealing
              with their day-to-day life. Otto’s 4D chess move unfolded and
              drove the narrative forward. Continue to see how they write the
              Flamechasers, Kevin’s burden and the way he carries everything on
              his own, Mobius mindset and the length she goes to preserve the
              ‘humanity’, Eden’s songs, her affect as the singer and how she
              stands for the influence of art, Pardo’s scheming, Su’s lore drop
              and see more of Elysia love.
              <br />
              <br />
              I did not want it to end, I want to relive the moment as if that
              was the first time ever. I also want to say I was not ready to
              move on.
              <br />
              <br />
              I did not want to forget about them, about anything. Maybe it’s a
              strong reason why I made this.
              <br />
              <br />I want to always look back at it fondly.
            </p>
            <hr className="my-4" />
            <p>
              Honkai Impact 3rd is not a good game by my standards now, maybe
              even more so with today’s quality, competition and expectations.
              <br />
              <br />
              Even if the game has gone to shit now, I truly enjoyed the
              experience and memories of the past and it should stay like that
              forever.
              <br />
              <br />
              Maybe now, in just a few years, the corporation behind it has lost
              its way, even if the game drags on forever and slowly loses even
              more of its charm over time, a former shell of itself used to
              shine so brightly. <br />
              <br />
              It exists.
              <br />
              <br />
              By the time you read this, by the time “you” read this, maybe this
              game might have received an end-of-service notice, maybe the name
              of the game won’t come up in any discussions, maybe the fandom
              will have different words to say about it, maybe “you” have
              changed… <br />
              <br />
              Until the unknown future, when it’s no more than a faint light of
              the past…. a story lost in time.
              <br />
              <br />
              I was happy. Very.
              <br />
              Thank you.
            </p>
            <p className="text-gray-800 p-4 bg-brand-quote-bg/8 italic mt-4 rounded">
              …<br />
              Most of them have long perished... The light our eyes catch is
              from tens of thousands of years ago. But still, this never
              diminishes their brilliance....
              <br />
              ...
              <br />
              Eden: The symbol of a time should fade away along with it. For me,
              the most brilliant starlight is seen during the downfall.
              <br />
              Mei: You... Are a lot more open-minded than many people I know.
              <br />
              Eden: Open-minded? Perhaps it's just hopelessness. Of course, art
              from different times often shares a lot in common. Through
              everything I created died with our era... You'll still be able to
              see something similar in your own time.
            </p>
          </div>
          <div className="italic text-right text-sm text-slate-500 my-12">
            ~ Their drawing ... are decicated to somewhere faraway from here.
          </div>
        </>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-1/2 gap-6">
      <motion.div
        className="flex gap-3"
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {values.map((val, i) => (
          <input
            key={i}
            ref={setInputRef(i)}
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-12 border-2 border-gray-200 text-3xl text-center uppercase
                       focus:outline-none focus:border-orange-200 rounded-sm text-brand"
          />
        ))}
      </motion.div>

      <UnlockButton onClick={handleUnlock}></UnlockButton>

      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-500 italic mt-[-18px]"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
