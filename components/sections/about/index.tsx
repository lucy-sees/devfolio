"use client";
import useCurSection from "@/hooks/use-cur-section";
import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import lucywmwangi from "@/public/imgs/lucy_avatar.png";
import { fadeUp, slideInLeft } from "@/lib/motion";

export default function AboutSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  useCurSection(ref);

  return (
    <div ref={ref} id="about" className="w-full py-12 my-32 bg-muted text-sm md:text-base">
      <h1 className="text-center text-3xl md:text-5xl mb-12">
        <span className="text-gradient-primary">{"{ "}</span>
        About Me
        <span className="text-gradient-primary">{" }"}</span>
      </h1>

      <div className="flex gap-9 items-center flex-col w-10/12 mx-auto p-5 rounded-lg container">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={slideInLeft}
          className="relative flex-shrink-0"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-primary opacity-50 size-[120px] rounded-full blur-3xl" />
          <div className="rounded-full size-[200px] bg-gradient-primary p-0.5">
            <Image
              className="size-full rounded-full grayscale hover:grayscale-0 transition-all object-cover"
              width={600}
              height={600}
              alt="Lucy W. Mwangi profile photo"
              src={lucywmwangi}
            />
          </div>
        </motion.div>

        <div className="space-y-4 text-center lg:text-left">
          <h2 className="text-xl md:text-3xl font-bold">
            <span className="text-secondary">{"< "}</span>
            <span className="text-gradient-secondary">Who am I</span>
            <span className="text-secondary">{" />"}</span>
          </h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="text-muted-foreground text-justify"
          >
            Hey, I&apos;m Lucy W. Mwangi, Tech Lead at Hurudevs and a Next.js
            &amp; React developer who helps businesses fix, optimize, scale,
            and build high-performance web applications. If your app is
            slow, buggy, struggling to scale, or missing key AI-driven
            features—I can help.
            <br />
            <br />
            <span className="font-semibold">📌 What I Do Best:</span>
            <br />
            ✅ Fixing Bugs &amp; Broken Code – Debugging, API issues, UI
            glitches that frustrate users.
            <br />
            ✅ Optimizing Performance – Speeding up apps, improving SEO, and
            delivering a smooth experience.
            <br />
            ✅ Scaling Web Apps – Making sure your app grows without
            downtime or technical limits.
            <br />
            ✅ Building from Scratch – Creating fast, scalable, and
            future-proof Next.js applications.
            <br />
            ✅ AI-Powered Features – Automating workflows, integrating
            chatbots, and enhancing user engagement.
            <br />
            <br />
            <span className="font-semibold">📌 Why Work With Me?</span>
            <br />
            🔹 I focus on real results, not just code. Your web app should
            run fast, handle traffic, and grow without breaking—I make sure
            it does.
            <br />
            🔹 I work fast and efficiently. No endless back-and-forth, no
            unnecessary delays—just solutions that work.
            <br />
            🔹 I don&apos;t just fix problems—I prevent them. Whether
            optimizing an existing app or building something new, I ensure
            it&apos;s scalable, maintainable, and built for the long run.
            <br />
            <br />
            <span className="font-semibold">📌 Let&apos;s Talk</span>
            <br />
            If your app needs fixing, optimizing, scaling, or building,
            let&apos;s connect.
            <br />
            <a href="#contact" className="text-primary hover:underline">
              ✅ Get in Touch
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
