"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { fadeUp } from "@/lib/motion";

type props = {
  project: {
    id: number;
    title: string;
    description: string;
    image: string;
    githubLink?: string;
    previewLink: string;
  };
};

export default function ProjectCard({ project }: props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      className="w-full max-w-[650px] rounded-2xl bg-muted border border-border sticky top-8"
    >
      <div className="flex justify-between flex-shrink-0 px-4 pt-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe size={18} />
          <span>Web-Page</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="block rounded-full size-3 bg-mint ml-auto" />
          <span className="block rounded-full size-3 bg-gold" />
          <span className="block rounded-full size-3 bg-pink" />
        </div>
      </div>
      <div className="group relative h-[200px] overflow-hidden cursor-pointer rounded-lg m-2 border border-border">
        <Image
          className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          src={project.image}
          alt={project.title}
          width={400}
          height={400}
        />
        <Link
          href={project.previewLink}
          target="_blank"
          className="size-full bg-black/50 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
        />
        <ExternalLink size={24} className="absolute top-4 right-4 opacity-90 hidden group-hover:block text-white" />
      </div>
      <div className="px-4 py-2 w-full">
        <h2 className="text-xl capitalize font-bold my-3">{project.title}</h2>
        <p className="text-muted-foreground h-[150px] overflow-hidden whitespace-pre-line">
          {project.description}
        </p>
        <div className="space-x-2 my-7">
          <Button asChild variant="secondary">
            <Link href={project.previewLink} target="_blank">
              Live view
            </Link>
          </Button>
          {project.githubLink && (
            <Button asChild variant="ghost" className="bg-muted-foreground/10">
              <Link href={project.githubLink} target="_blank">
                Git Hub
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
