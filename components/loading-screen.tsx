"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import animationData from "@/public/lottie/loading.json";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Intentional one-time mount signal so the loader only renders during
    // SSR/hydration and disappears once the client has taken over — this is
    // the documented exception to the set-state-in-effect rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false);
  }, []);

  // Hide loader once mounted
  if (!isLoading) return null;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-muted z-50 flex items-center justify-center">
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
}