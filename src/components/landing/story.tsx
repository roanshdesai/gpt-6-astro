"use client";

import LineByLineSlide from "@/components/smoothui/line-by-line-slide";
import { BlurFade } from "@/components/ui/blur-fade";
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity";
import { cn } from "@/lib/utils";

/*
 * The page after the hero. Every section is see-through: the sky, the stars and
 * the chamber keep running behind the text, and the chamber moves to the free
 * side of each one (see WAYPOINTS in scene/flame-canvas.tsx, one per section).
 *
 * Statements follow the challenge brief and NASA's own descriptions.
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
      { value: "Saffire", label: "Fabric, inside a cargo ship" },
    ],
  },
  {
    label: "04 · Oxygen",
    title: "The Moon Base will\nhold more oxygen.",
    body: "To make moonwalks easier, the Moon Base is expected to run at 30% oxygen or more. The air on Earth is 21%. Materials catch and burn far more readily in that.",
    side: "left",
    readout: [
      { value: "21%", label: "Oxygen on Earth" },
      { value: "30%+", label: "Oxygen on the Moon Base" },
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

const INCIDENTS = [
  { year: "1967", name: "Apollo 1", text: "Fire in an oxygen-filled cabin during a test on the pad. The crew died." },
  { year: "1970", name: "Apollo 13", text: "An oxygen tank exploded on the way to the Moon. The crew made it home." },
  { year: "1997", name: "Mir", text: "An oxygen generator failed and started a fire on the station. The crew survived." },
  { year: "2026", name: "Artemis II", text: "A smoke alarm went off about 80,000 miles from home." },
];

const INVESTIGATIONS = [
  ["PSI-26", "BASS", "Burning and Suppression of Solids"],
  ["PSI-25", "BASS-II", "Burning and Suppression of Solids II"],
  ["PSI-98", "Saffire-I", "Spacecraft Fire Safety Experiment I"],
  ["PSI-99", "Saffire-II", "Spacecraft Fire Experiment II"],
  ["PSI-100", "Saffire-III", "Spacecraft Fire Experiment III"],
  ["PSI-69", "FLEX", "Flame Extinguishment Experiment"],
  ["PSI-68", "FLEX-2", "Flame Extinguishment Experiment 2"],
  ["PSI-39", "CFI", "Cool Flames Investigation"],
  ["PSI-102", "SAME", "Smoke and Aerosol Measurement Experiment"],
  ["PSI-101", "SAME-R", "Smoke Aerosol Measurement Experiment, Reflight"],
  ["PSI-47", "DAFT", "Dust and Aerosol Measurement Feasibility Test"],
  ["PSI-107", "SPICE", "Smoke Point In Co-flow Experiment"],
  ["PSI-106", "SLICE", "Structure and Liftoff In Combustion Experiment"],
  ["PSI-20", "ACME BRE", "Burning Rate Emulator"],
  ["PSI-159", "ACME CFI-G", "Cool Flames Investigation with Gases"],
  ["PSI-21", "ACME CLD Flame", "Coflow Laminar Diffusion Flame"],
  ["PSI-22", "ACME E-FIELD", "Electric-Field Effects on Laminar Diffusion Flames"],
  ["PSI-23", "ACME s-Flame", "Structure and Response of Spherical Diffusion Flames"],
  ["PSI-10", "ACME Flame Design", "Flame Design"],
];

const PILLARS = [
  {
    name: "Prevent",
    questions: ["Is a 30% oxygen Moon Base safe?", "Does cabin airflow feed a fire?", "Which materials burn differently up there?"],
  },
  {
    name: "Detect",
    questions: ["Will an alarm catch a fire with no rising smoke?", "Can a detector tell smoke from dust?", "What does an early space fire look like?"],
  },
  {
    name: "Suppress",
    questions: ["What puts a fire out without gravity?", "Does switching off the fans stop it?", "Can a fire come back after it looks out?"],
  },
];

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

export function Story() {
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
            <span className="mx-[3vw]">24 investigations.</span>
            <span className="mx-[3vw] text-ink-subtle">One board.</span>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
        <div className="px-[3vw]">
          <ul className="grid max-w-[46rem] grid-cols-1 gap-x-10 md:grid-cols-2">
            {INVESTIGATIONS.map(([id, acronym, title]) => (
              <li
                key={id}
                className="group grid grid-cols-[4.25rem_1fr] items-baseline gap-x-4 border-t border-hairline-strong py-3 transition-colors duration-150"
              >
                <span className={cn("font-mono text-[12px] tabular-nums text-ink-muted", SHADOW)}>{id}</span>
                <span className="flex flex-col">
                  <span className={cn("text-lg font-semibold tracking-[-0.02em] text-ink", SHADOW)}>
                    {acronym}
                  </span>
                  <span className={cn("text-[14px] leading-snug text-ink-muted", SHADOW)}>{title}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className={cn("mt-6 max-w-[36rem] font-mono text-[13px] text-ink-muted", SHADOW)}>
            Flight investigations in NASA&apos;s Physical Sciences Informatics repository. Five
            ground studies make up the rest of the 24.
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
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <BlurFade key={pillar.name} inView blur="0px" offset={12} delay={index * 0.1}>
              <div className="flex flex-col border-t border-ink">
                <h3 className={cn("py-4 font-mono text-[13px] text-ink", SHADOW)}>
                  {`0${index + 1}`} · {pillar.name}
                </h3>
                <ul className="flex flex-col">
                  {pillar.questions.map((question) => (
                    <li
                      key={question}
                      className={cn(
                        "border-t border-hairline-strong py-4 text-xl font-semibold leading-tight tracking-[-0.02em]",
                        SHADOW,
                      )}
                    >
                      {question}
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
