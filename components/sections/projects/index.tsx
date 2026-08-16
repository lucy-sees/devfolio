"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import LaptopAnimation from "./laptop-animation";
import ProjectCard from "./project-card";
import useCurSection from "@/hooks/use-cur-section";
import data from "@/data";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  useCurSection(ref, 0.1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stickyRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      id="projects"
      className="w-full p-12 flex justify-between flex-col items-center lg:flex-row lg:items-stretch gap-12 container my-32 text-sm md:text-base"
    >
      <div ref={stickyRef}>
        <div className="sticky top-8 text-center md:text-left">
          <Image
            className="absolute -top-2 -left-5 -z-10 text-transparent opacity-30 w-full h-1/2 object-cover"
            src="/svgs/grid.svg"
            alt="grid image"
            width={0}
            height={0}
          />
          <h1 className="text-3xl md:text-4xl text-gradient-primary">
            <span>{"//"}</span>
            Recent Projects
          </h1>
          <LaptopAnimation className="w-[300px] -scale-x-100 scale-y-100 mx-auto md:mx-0" />
          <p className="w-[400px] max-w-full text-muted-foreground">
            Building, Fixing &amp; Scaling Next.js &amp; AI Apps That Actually Work
          </p>
        </div>
      </div>
      <div className="space-y-[60vh]">
        {data.projects.projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
