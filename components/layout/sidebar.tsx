import data from "@/data";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="h-full border-r border-border bg-muted hidden lg:flex flex-col justify-start flex-shrink-0">
      <Link
        href="/"
        className={cn(
          "relative size-14 flex items-center justify-center text-foreground bg-background hover:bg-background transition-colors"
        )}
      >
        <ActiveIndicator />
        <Info size={20} />
      </Link>

      <div className="flex flex-col mt-auto">
        {data.sidebar.links.map(
          (link) =>
            link.link && (
              <Link
                key={link.name}
                href={link.link}
                target="_blank"
                className="relative size-14 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-background/60 transition-colors"
              >
                <link.icon size={20} />
              </Link>
            )
        )}
      </div>
    </div>
  );
}

const ActiveIndicator = () => (
  <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-full" />
);
