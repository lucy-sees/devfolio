"use client";
import useHash from "@/hooks/use-hash";
import { cn } from "@/lib/utils";
import { File, Home, Send, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const navItems = [
  { id: 1, name: "Home.tsx", path: "#home", icon: Home },
  { id: 2, name: "About.tsx", path: "#about", icon: User },
  { id: 3, name: "Projects.tsx", path: "#projects", icon: File },
  { id: 4, name: "Contact-Me.tsx", path: "#contact", icon: Send, isRight: true },
];

export default function Header() {
  const { hash } = useHash();

  return (
    <div className="w-full h-12 border-b border-border bg-muted/60 flex items-center backdrop-blur-sm">
      {/* Logo */}
      <div className="w-14 flex items-center justify-center flex-shrink-0 font-bold border-r border-border">
        <Image src="/imgs/logo.png" alt="LM Logo" width={28} height={28} className="object-contain" />
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center size-full">
        {navItems.map((item) => {
          const isActive = item.path === hash || (item.path === "#home" && !hash);
          return (
            <Link
              key={item.id}
              href={item.path}
              scroll
              className={cn(
                "group relative h-full w-fit md:min-w-40 flex items-center justify-start gap-2 text-muted-foreground hover:bg-background/50 px-4 border-r border-border transition-colors",
                isActive && "text-foreground bg-background/80 hover:bg-background/80",
                item.isRight && "ml-auto"
              )}
            >
              <item.icon size={14} className={cn(isActive && "text-primary")} />
              <span className="hidden md:inline">{item.name}</span>

              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
