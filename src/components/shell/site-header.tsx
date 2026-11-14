import Link from "next/link";

import { cn } from "@/lib/utils";

export type Tab = "home" | "dashboard" | "questions" | "investigations";

const TABS: { id: Tab; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "questions", label: "Questions", href: "/board" },
  { id: "investigations", label: "Investigations", href: "/investigations" },
];

/** The top bar on every page: the name, then the tabs. No tab is marked on a page that belongs to none. */
export function SiteHeader({ current }: { current?: Tab }) {
  // Home sits over a photograph, so its bar needs a shadow and no rule.
  const overPhoto = current === "home";

  return (
    <header
      className={cn(
        "relative z-20 flex items-center justify-between gap-6 px-[3vw] font-mono text-[12px] text-ink sm:text-[13px]",
        overPhoto ? "py-2 [text-shadow:0_1px_14px_rgb(3_3_4/0.95)]" : "border-b border-hairline",
      )}
    >
      <Link href="/" className="py-5 max-lg:hidden">
        Question Board
      </Link>
      <nav aria-label="Main" className="-mx-2 flex items-stretch sm:mx-0 sm:gap-2">
        {TABS.map((tab) => {
          const active = tab.id === current;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-14 items-center px-2 transition-colors duration-150 sm:px-4",
                active ? "text-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {tab.label}
              {/* The active tab is marked by a bar on the bottom edge. */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-2 bottom-0 h-0.5 origin-left bg-ink transition-transform duration-150 sm:inset-x-4",
                  active ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          );
        })}
      </nav>
      <a
        href="https://psi.nasa.gov/physci/repo/search?q=combustion"
        target="_blank"
        rel="noreferrer"
        className="link-draw py-3 text-ink-muted hover:text-ink max-md:hidden"
      >
        NASA PSI data
      </a>
    </header>
  );
}
