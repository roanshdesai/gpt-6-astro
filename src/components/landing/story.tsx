"use client";

import Link from "next/link";

import landing from "../../../data/landing.json";

import LineByLineSlide from "@/components/smoothui/line-by-line-slide";
import { BlurFade } from "@/components/ui/blur-fade";
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity";
import { cn } from "@/lib/utils";

/*
 * The page after the hero. Every section is see-through: the sky, the stars and
 * the chamber keep running behind the text, and the chamber moves to the free
 * side of each one (see WAYPOINTS in scene/flame-canvas.tsx, one per section).
 *
 * The chapter statements follow NASA's challenge brief for "Flame in Freefall"
 * and the saved NASA pages. Names and question wording arrive as props from the
 * checked data files (see app/page.tsx).
 */

const SHADOW = "[text-shadow:0_1px_18px_rgb(3_3_4/0.95)]";

type Chapter = {
  label: string;
  title: string;
  body: string;
  side: "left" | "right";
  readout?: { value: string; label: string }[];
};

const CHAPTERS: Chapter[] = [
  {
    label: "01 · Shape",
    title: "Flames become\nspheres.",
    body: "On Earth, hot gas rises and pulls fresh air in from below. In freefall there is no up, so a flame is fed only by oxygen drifting in from every side. NASA's droplet experiments burned fuel exactly like this.",
    side: "right",
    readout: [
      { value: "FLEX", label: "Burning fuel droplets" },
      { value: "FLEX-2", label: "Burning fuel droplets" },
    ],
  },
  {
    label: "02 · Detection",
    title: "Smoke has\nnowhere to rise.",
    body: "A smoke detector on Earth waits on the ceiling for the smoke to come to it. In a spacecraft, smoke goes wherever the cabin air carries it. NASA tested detectors in microgravity to see what they actually catch.",
    side: "left",
    readout: [
      { value: "SAME", label: "Smoke detection" },
      { value: "SAME-R", label: "Smoke detection" },
    ],
  },
  {
    label: "03 · Airflow",
    title: "A fan can\nfeed a fire.",
    body: "Without rising air, a flame lives on whatever breeze reaches it. Cabin ventilation becomes part of the fire. NASA burned fabrics and plastics in moving air to learn how much it matters.",
    side: "right",
    readout: [
      { value: "BASS-II", label: "Solids in airflow" },
      { value: "SAFFIRE", label: "Materials, inside a cargo ship" },
    ],
  },
  {
    label: "04 · Oxygen",
    title: "The Moon Base will\nhold more oxygen.",
    body: "To make moonwalks easier, NASA expects the Moon Base to hold more oxygen at lower pressure: likely 30% or more. The air on Earth is 21%. NASA's brief for this challenge says that makes materials much more flammable.",
    side: "left",
    readout: [
      { value: "21%", label: "Oxygen on Earth" },
      { value: "30%+", label: "Likely on the Moon Base" },
    ],
  },
  {
    label: "05 · Suppression",
    title: "So what\nputs it out?",
    body: "NASA thinned the air around a burning droplet with carbon dioxide and with helium, to find what it takes to stop a flame that has no reason to go anywhere.",
    side: "right",
    readout: [
      { value: "CO₂", label: "Tested as a suppressant" },
      { value: "He", label: "Tested as a suppressant" },
    ],
  },
];

// The incident cards are the data track's: each one is checked word for word
// against a saved NASA page before the site builds.
const INCIDENTS = landing.incidents;

type Flight = { id: string; name: string; title: string };
type PillarColumn = { name: string; questions: { id: string; text: string }[] };

type StoryProps = {
  /** The flight investigations, as NASA names them. */
  flights: Flight[];
  /** The three pillars with their questions. */
  pillars: PillarColumn[];
  /** How many investigations there are in all, and how many are ground studies. */
  total: number;
  ground: number;
};

function ChapterSection({ chapter }: { chapter: Chapter }) {
  return (
    <section className="relative z-20 flex min-h-svh items-center px-[3vw] py-24">
      <div className={cn("flex w-full max-w-[36rem] flex-col gap-7", chapter.side === "right" && "lg:ml-auto")}>
        <p className={cn("font-mono text-[13px] text-ink-muted", SHADOW)}>{chapter.label}</p>
        <h2
          className={cn(
            "text-[clamp(2.6rem,5.8vw,6.25rem)] font-bold leading-[0.92] tracking-[-0.04em]",
            SHADOW,
          )}
        >
          <LineByLineSlide triggerOnView>{chapter.title}</LineByLineSlide>
        </h2>
        <BlurFade inView blur="0px" offset={12} delay={0.15}>
          <p className={cn("max-w-[30rem] text-xl leading-snug text-ink", SHADOW)}>{chapter.body}</p>
        </BlurFade>
        {chapter.readout && (
          <BlurFade inView blur="0px" offset={12} delay={0.25}>
            <dl className="grid max-w-[30rem] grid-cols-2 border-t border-hairline-strong">
              {chapter.readout.map((item) => (
                <div
                  key={item.value}
                  className="flex flex-col gap-1 border-l border-hairline-strong py-4 pl-4 first:border-l-0 first:pl-0"
                >
                  <dd className={cn("font-mono text-3xl tabular-nums text-ink", SHADOW)}>{item.value}</dd>
                  <dt className={cn("text-[13px] text-ink-muted", SHADOW)}>{item.label}</dt>
                </div>
              ))}
            </dl>
          </BlurFade>
        )}
      </div>
    </section>
  );
}

export function Story({ flights, pillars, total, ground }: StoryProps) {
  return (
    <>
      {CHAPTERS.map((chapter) => (
        <ChapterSection key={chapter.label} chapter={chapter} />
      ))}

      {/* It has already happened */}
      <section id="happened" className="relative z-20 flex min-h-svh items-center px-[3vw] py-24">
        <div className="flex w-full max-w-[40rem] flex-col gap-10">
          <p className={cn("font-mono text-[13px] text-ink-muted", SHADOW)}>06 · Record</p>
          <h2
            className={cn(
              "text-[clamp(2.6rem,5.8vw,6.25rem)] font-bold leading-[0.92] tracking-[-0.04em]",
              SHADOW,
            )}
          >
            <LineByLineSlide triggerOnView>{"It has already\nhappened."}</LineByLineSlide>
          </h2>
          <ol className="flex flex-col">
            {INCIDENTS.map((incident, index) => (
              <BlurFade key={incident.name} inView blur="0px" offset={10} delay={index * 0.08}>
                <li className="grid grid-cols-[4.5rem_1fr] gap-x-6 border-t border-hairline-strong py-5 md:grid-cols-[4.5rem_9rem_1fr]">
                  <span className={cn("font-mono text-[13px] tabular-nums text-ink-muted", SHADOW)}>
                    {incident.year}
                  </span>
                  <span className={cn("text-xl font-semibold tracking-[-0.02em]", SHADOW)}>
                    {incident.name}
                  </span>
                  <span className={cn("col-start-2 text-lg leading-snug text-ink md:col-start-3", SHADOW)}>
                    {incident.text}
                  </span>
                </li>
              </BlurFade>
            ))}
          </ol>
        </div>
      </section>

      {/* The investigations */}
      <section className="relative z-20 flex min-h-svh flex-col justify-center gap-12 py-24">
        <ScrollVelocityContainer
          className={cn("text-[clamp(3rem,9vw,9rem)] font-bold leading-none tracking-[-0.045em]", SHADOW)}
        >
          <ScrollVelocityRow baseVelocity={3} direction={1}>
            <span className="mx-[3vw]">{total} investigations.</span>
            <span className="mx-[3vw] text-ink-subtle">One board.</span>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
        <div className="px-[3vw]">
          <ul className="grid max-w-[46rem] grid-cols-1 gap-x-10 md:grid-cols-2">
            {flights.map((flight) => (
              <li key={flight.id} className="border-t border-hairline-strong">
                <Link
                  href={`/investigations/${flight.id}`}
                  className="group grid grid-cols-[4.25rem_1fr] items-baseline gap-x-4 py-3"
                >
                  <span className={cn("font-mono text-[12px] tabular-nums text-ink-muted", SHADOW)}>
                    {flight.id}
                  </span>
                  <span className="flex flex-col">
                    <span className={cn("text-lg font-semibold tracking-[-0.02em] text-ink", SHADOW)}>
                      <span className="link-draw">{flight.name}</span>
                    </span>
                    <span className={cn("text-[14px] leading-snug text-ink-muted", SHADOW)}>
                      {flight.title}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className={cn("mt-6 max-w-[36rem] font-mono text-[13px] text-ink-muted", SHADOW)}>
            The {flights.length} flight investigations in NASA&apos;s Physical Sciences Informatics
            repository. {ground} ground studies make up the rest of the {total}.
          </p>
        </div>
      </section>

      {/* The board */}
      <section className="relative z-20 flex min-h-svh flex-col justify-end gap-12 px-[3vw] pt-24 pb-28">
        <div className="flex max-w-[44rem] flex-col gap-6">
          <p className={cn("font-mono text-[13px] text-ink-muted", SHADOW)}>08 · The Question Board</p>
          <h2
            className={cn(
              "text-[clamp(2.6rem,5.8vw,6.25rem)] font-bold leading-[0.92] tracking-[-0.04em]",
              SHADOW,
            )}
          >
            <LineByLineSlide triggerOnView>{"Ask the question.\nSee the evidence."}</LineByLineSlide>
          </h2>
          <p className={cn("max-w-[32rem] text-xl leading-snug text-ink", SHADOW)}>
            Each question ranks the investigations by how much they tell us, and shows NASA&apos;s
            own words: what was tested, what was expected, and what was found.
          </p>
        </div>
        <Link
          href="/board"
          className="inline-flex h-11 w-fit items-center rounded-[2px] bg-ink px-5 text-[15px] font-medium text-canvas transition-[transform,background-color] duration-150 hover:bg-ink-muted active:scale-[0.98]"
        >
          Open the questions
        </Link>
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <BlurFade key={pillar.name} inView blur="0px" offset={12} delay={index * 0.1}>
              <div className="flex flex-col border-t border-ink">
                <h3 className={cn("py-4 font-mono text-[13px] text-ink", SHADOW)}>
                  {`0${index + 1}`} · {pillar.name}
                </h3>
                <ul className="flex flex-col">
                  {pillar.questions.map((question) => (
                    <li key={question.id} className="border-t border-hairline-strong">
                      <Link
                        href={`/board/${question.id}`}
                        className={cn(
                          "group block py-4 text-xl font-semibold leading-tight tracking-[-0.02em]",
                          SHADOW,
                        )}
                      >
                        <span className="link-draw">{question.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </BlurFade>
          ))}
        </div>
        <footer className={cn("flex flex-wrap justify-between gap-x-10 gap-y-2 font-mono text-[12px] text-ink-muted", SHADOW)}>
          <span>Sky: NASA photograph iss074e0521637, NASA/Chris Williams</span>
          <span>Flame and chamber: simulation</span>
          <span>NASA Space Apps Challenge 2026 · Flame in Freefall</span>
        </footer>
      </section>
    </>
  );
}
