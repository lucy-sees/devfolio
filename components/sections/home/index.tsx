// components/sections/home/index.tsx
"use client";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import HeroCanvas from "@/components/three/hero-canvas";
import CodeTyping from "./code-typing";
import data from "@/data";
import { EASE_OUT, fadeUp, staggerContainer } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function HomeSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  // GSAP owns scroll-linked motion: a slow parallax drift on the 3D scene
  // as the hero leaves the viewport. Framer Motion (below) owns everything
  // that is not scroll-driven — entrance choreography and hover/tap states.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(canvasWrapRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-full flex flex-col xl:flex-row gap-12 p-6 items-center justify-center overflow-hidden container text-center md:text-left"
    >
      {/* Vanilla three.js abstract "code core" behind the hero copy */}
      <div
        ref={canvasWrapRef}
        className="absolute inset-0 -z-10 opacity-70"
      >
        <HeroCanvas className="size-full" />
      </div>
      <div className="absolute inset-0 -z-20 bg-grid-purple-900 opacity-40" />

      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        animate="show"
        className="space-y-7 text-center xl:text-left xl:text-xl relative"
      >
        <div className="-space-y-1">
          <motion.p variants={fadeUp} className="text-sky">
            Hello 👋, I&apos;m
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="relative text-6xl xl:text-8xl !leading-[1.4] text-gradient-primary"
          >
            {data.home.name}
          </motion.h1>
          {data.home.role && (
            <motion.p variants={fadeUp} className="text-mint font-mono text-base xl:text-lg">
              {data.home.role}
            </motion.p>
          )}
          <motion.h2 variants={fadeUp} className="text-secondary font-mono">
            {"// "}
            {data.home.description.split(/#(\w+)/g).map((e, i) =>
              i % 2 === 0 ? (
                e
              ) : (
                <span key={`wrapped_${i}`} className="text-mint">
                  {`{${e.replaceAll("__", "-").replaceAll("_", " ")}}`}
                </span>
              )
            )}
          </motion.h2>
        </div>

        <motion.div variants={fadeUp} className="flex flex-row gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push("#projects")}
              className="filled-button"
            >
              See My Work
            </Button>
          </motion.div>

          {data.home.cvLink && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div className="relative rounded-lg animate-rotate-gradient">
                <Button
                  asChild
                  variant="ghost"
                  className="relative bg-background hover:bg-background text-foreground outlined-button"
                >
                  <Link href={data.home.cvLink}>Contact Me</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: EASE_OUT }}
        className="relative w-full max-w-2xl neon-code-container rounded-lg"
      >
        <CodeTyping />
        <div className="absolute inset-0 -z-10 bg-primary/10 blur-3xl rounded-lg" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() => router.push("#about")}
      >
        <ScrollIndicator />
      </motion.div>
    </section>
  );
}

const ScrollIndicator = () => (
  <div className="mouse w-24 mx-auto">
    <div className="mouse-icon w-6 h-11 border-2 border-sky rounded-full relative text-center">
      <motion.span
        animate={{ y: [2, 20, 20], opacity: [0, 1, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.3, 0.5] }}
        className="mouse-wheel block w-1 h-1.5 bg-sky rounded-full mx-auto"
      />
    </div>
  </div>
);
