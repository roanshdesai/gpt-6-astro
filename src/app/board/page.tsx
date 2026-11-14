import type { Metadata } from "next";

import { QuestionCard } from "@/components/board/question-card";
import { SiteHeader } from "@/components/shell/site-header";
import { PILLARS, investigations, questions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Questions: fire safety answered from NASA combustion investigations | Question Board",
  description:
    "Fire-safety questions for spacecraft, stations and Moon bases. Each one ranks NASA's microgravity combustion investigations by the evidence they give.",
};

export default function BoardPage() {
  const across = questions.filter((item) => item.pillar === "across");

  return (
    <main className="relative z-20 min-h-svh pb-32">
      <SiteHeader current="questions" />

      <div className="mx-auto flex max-w-[96rem] flex-col gap-12 px-[3vw] pt-10">
        <div className="flex max-w-[52rem] flex-col gap-6">
          <h1 className="text-[clamp(2.25rem,4.2vw,4rem)] leading-[0.98] tracking-[-0.035em]">
            {questions.length} questions.
            <br />
            {investigations.length} investigations.
          </h1>
          <p className="max-w-[36rem] text-xl leading-snug text-ink-muted">
            Pick a question. Each one ranks the investigations by how much they tell us, and shows
            NASA&apos;s own sentences that say so.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <section key={pillar.id} className="flex flex-col gap-4">
              <div className="flex items-baseline gap-4 border-t border-ink pt-4">
                <span className="font-mono text-[13px] text-ink-muted">{`0${index + 1}`}</span>
                <h3 className="text-2xl font-semibold tracking-[-0.02em]">{pillar.name}</h3>
                <span className="font-mono text-[13px] text-ink-muted">{pillar.line}</span>
              </div>
              {questions
                .filter((item) => item.pillar === pillar.id)
                .map((item) => (
                  <QuestionCard key={item.id} question={item} />
                ))}
            </section>
          ))}
        </div>

        {across.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex items-baseline gap-4 border-t border-ink pt-4">
              <span className="font-mono text-[13px] text-ink-muted">04</span>
              <h3 className="text-2xl font-semibold tracking-[-0.02em]">Across all three</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {across.map((item) => (
                <QuestionCard key={item.id} question={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
