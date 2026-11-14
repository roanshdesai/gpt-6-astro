import { Hero } from "@/components/landing/hero";
import { Story } from "@/components/landing/story";
import { FlameScene } from "@/components/scene/flame-scene";
import { GravityProvider } from "@/components/scene/gravity";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function Home() {
  return (
    <GravityProvider>
      <SmoothScroll>
        <FlameScene />
        <main className="relative">
          <Hero />
          <Story />
        </main>
      </SmoothScroll>
    </GravityProvider>
  );
}
