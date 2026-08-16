"use client";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

// Subscribes to the browser's URL hash via useSyncExternalStore instead of
// mirroring window.location.hash into state inside an effect — this reads
// correctly on the very first render and updates on back/forward navigation.
function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

function getSnapshot() {
  return window.location.hash;
}

function getServerSnapshot() {
  return "";
}

export default function useHash() {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const router = useRouter();

  const updateHash = (newHash: string) => {
    router.push(`#${newHash}`, { scroll: false });
  };

  return { hash, updateHash };
}
