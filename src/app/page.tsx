import { Hero } from "@/components/landing/hero";
import { Story } from "@/components/landing/story";
import { PILLARS, investigations, questions } from "@/lib/data";

export default function Home() {
  // Names and question wording come from the checked data files, never typed by hand.
  const flights = investigations
    .filter((item) => item.kind === "flight")
    .map((item) => ({ id: item.id, name: item.acronym ?? item.id, title: item.title }));

  const pillars = PILLARS.map((pillar) => ({
    name: pillar.name,
    questions: questions
      .filter((item) => item.pillar === pillar.id)
      .map((item) => ({ id: item.id, text: item.question })),
  }));

  return (
    <main className="relative">
      <Hero />
      <Story
        flights={flights}
        pillars={pillars}
        total={investigations.length}
        ground={investigations.length - flights.length}
      />
    </main>
  );
}
