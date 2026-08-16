// components/sections/home/code-typing.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import { EASE_OUT } from "@/lib/motion";

const CODE_SNIPPET = `// Welcome to my AI-Powered Portfolio! 🚀
import { TechLead } from 'hurudevs';
import { AIExpertise } from '@/skills';

function createAmazingWebsite() {
  const mySkills = {
    role: "Tech Lead @ Hurudevs",
    webDev: ["Next.js", "React", "TS"],
    aiTools: ["Gemini", "OpenAI", "ML"],
    passion: "Building AI-powered web apps",
  };

  return {
    message: "Let's work together!",
    services: ["Web Apps", "AI Features"],
    contact: "Scroll down to connect →",
  };
}`;

const TOTAL_CHARS = CODE_SNIPPET.length;
// This snippet carries the crucial portfolio info (role, skills, contact),
// so it needs to be readable almost immediately on load — the whole thing
// finishes typing in well under a second instead of several seconds.
const TYPE_DURATION_MS = 650;

export default function CodeTyping() {
  const [visibleChars, setVisibleChars] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / TYPE_DURATION_MS, 1);
      // Ease-out so the first characters (imports/setup) land fast and the
      // closing brace settles in smoothly rather than snapping abruptly.
      const eased = 1 - Math.pow(1 - progress, 2);
      setVisibleChars(Math.round(eased * TOTAL_CHARS));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const displayedCode = CODE_SNIPPET.slice(0, visibleChars);
  const isTyping = visibleChars < TOTAL_CHARS;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="rounded-lg bg-muted p-4 w-full max-w-[450px] font-mono max-[400px]:text-[0.6rem] text-xs sm:text-sm overflow-hidden shadow-lg justify-self-center"
    >
      {/* Fake macOS window buttons */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-gold" />
        <div className="h-3 w-3 rounded-full bg-mint" />
      </div>

      <Highlight
        theme={themes.vsDark}
        code={displayedCode}
        language="tsx"
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <div className="space-y-1 text-left">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="flex">
                <span className="mr-4 select-none opacity-40 w-5 text-right flex-shrink-0">
                  {i + 1}
                </span>
                <span className="relative flex-1 whitespace-pre-wrap break-words">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                  {isTyping && i === tokens.length - 1 && (
                    <span className="inline-block h-[1.1em] w-[2px] -mb-0.5 bg-primary animate-pulse" />
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </Highlight>
    </motion.div>
  );
}
