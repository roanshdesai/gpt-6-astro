import { Page, TopNav } from "@/components/investigation/parts";

// Plain 404 in the site's dark theme (backend part 7). Shown for unknown
// /investigations/<id> (see src/proxy.ts) and any other unknown path.
// Roansh's motion pass can restyle it.
export default function NotFound() {
  return (
    <Page>
      <TopNav />
      <header className="flex flex-col gap-4">
        <p className="font-mono text-[13px] text-ink-muted">404</p>
        <h1 className="text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] tracking-[-0.04em]">Nothing here</h1>
        <p className="max-w-2xl text-lg leading-snug text-ink-muted">
          This page does not exist. NASA&apos;s 24 combustion investigations are listed under All 24 investigations.
        </p>
      </header>
    </Page>
  );
}
