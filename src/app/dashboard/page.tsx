import type { Metadata } from "next";
import Link from "next/link";

import { CoverageMatrix } from "@/components/dashboard/coverage-matrix";
import { Brackets } from "@/components/dashboard/hud";
import { KindLegend } from "@/components/dashboard/kind-mark";
import { Overview } from "@/components/dashboard/overview";
import { Panel } from "@/components/dashboard/panel";
import { QuestionReach } from "@/components/dashboard/question-reach";
import { RankedBars } from "@/components/dashboard/ranked-bars";
import { ResultGrid } from "@/components/dashboard/result-grid";
import { YearColumns } from "@/components/dashboard/year-columns";
import { SiteHeader } from "@/components/shell/site-header";
import { BlurFade } from "@/components/ui/blur-fade";
import { activity, dates, papers, reach, standingCount, totals } from "@/lib/stats";
import type { Pillar } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard: NASA's fire experiments, counted | Question Board",
  description:
    "What NASA's 24 open combustion investigations hold, in four plain questions: how much evidence is behind each fire-safety question, how many experiments state a result, when they ran, and where the published work is.",
};

const ABOUT: Record<Pillar, string> = {
  prevent: "preventing a fire",
  detect: "detecting a fire",
  suppress: "putting a fire out",
  across: "the bigger picture",
};

const list = (items: (string | number)[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

// Each answer is written from the counts, so it cannot drift from its chart.

function reachAnswer() {
  const none = reach.filter((row) => row.results === 0);
  const some = reach.length - none.length;
  const whole = totals.investigations;
  if (none.length === 0) return `All ${reach.length} questions have a result from at least one of the ${whole} experiments.`;
  const lead = `${some} of the ${reach.length} questions have a result from at least one of the ${whole} experiments.`;
  const shared = none.every((row) => row.question.pillar === none[0].question.pillar);
  if (none.length === 1) return `${lead} One does not.`;
  const tail = shared ? ` ${none.length === 2 ? "Both" : "All"} are about ${ABOUT[none[0].question.pillar]}.` : "";
  return `${lead} ${none.length} do not.${tail}`;
}

function standingAnswer() {
  return `${standingCount.result} of ${totals.investigations}. Another ${standingCount.cited} are quoted only for what they tested or expected.`;
}

function yearsAnswer() {
  const peak = Math.max(...activity.map((entry) => entry.count));
  const busiest = activity.filter((entry) => entry.count === peak).map((entry) => entry.year);
  return `Between ${dates.firstYear} and ${dates.lastYear}. The busiest ${busiest.length === 1 ? "year was" : "years were"} ${list(busiest)}, with ${peak} running at once.`;
}

function yearsNote() {
  const parts = ["Counted from the years on each NASA record."];
  if (dates.undated > 0) parts.push(`${dates.undated} experiments list no years and are left out.`);
  if (dates.open > 0) parts.push(`${dates.open} ${dates.open === 1 ? "lists" : "list"} a start and no end, and ${dates.open === 1 ? "is" : "are"} counted in the start year only.`);
  return parts.join(" ");
}

function papersAnswer() {
  const [first, second, third] = papers;
  return `${first.name} lists ${first.value} papers, ${second.name} ${second.value} and ${third.name} ${third.value}.`;
}

export default function DashboardPage() {
  const most = papers[0].value;
  const half = Math.ceil(papers.length / 2);

  return (
    <main className="relative z-20 min-h-svh pb-12">
      <SiteHeader current="dashboard" />

      <div className="mx-auto flex max-w-[96rem] flex-col gap-6 px-[3vw] pt-10">
        <header className="flex max-w-[46rem] flex-col gap-4 pb-4">
          <h1 className="text-[clamp(2.25rem,4.2vw,4rem)] leading-[0.98] tracking-[-0.035em]">
            NASA&apos;s fire experiments, counted
          </h1>
          <p className="text-xl leading-snug text-ink-muted">
            Four plain questions about what NASA&apos;s open combustion data holds. Each one is
            answered in a sentence, with the chart underneath.
          </p>
        </header>

        <BlurFade inView>
          <Overview />
        </BlurFade>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <BlurFade inView className="xl:col-span-7">
            <Panel
              id="evidence"
              label="01 · Evidence"
              className="h-full"
              question="How much evidence is behind each fire-safety question?"
              answer={reachAnswer()}
              note="Each square is one experiment listed as evidence for that question. It is filled when the question quotes a sentence in which NASA states a result for that experiment. A question can also quote a general NASA finding that is not tied to one experiment; those are on its page and are not counted here."
            >
              <QuestionReach />
            </Panel>
          </BlurFade>

          <div className="flex flex-col gap-6 xl:col-span-5">
            <BlurFade inView delay={0.05}>
              <Panel
                id="results"
                label="02 · Results"
                question={`How many of the ${totals.investigations} experiments have a result quoted on this site?`}
                answer={standingAnswer()}
                note="Results are quoted word for word from the NASA PSI records and from NASA's Researcher's Guide to combustion. An experiment without a quoted result may still have results in its published papers, which this site does not read. NASA prints some result sentences on both the BASS and BASS-II records, so both count."
              >
                <ResultGrid />
              </Panel>
            </BlurFade>

            <BlurFade inView delay={0.1} className="flex-1">
              <Panel
                id="years"
                label="03 · Years"
                className="h-full"
                question="When did the experiments run?"
                answer={yearsAnswer()}
                note={yearsNote()}
              >
                <YearColumns />
              </Panel>
            </BlurFade>
          </div>
        </div>

        <BlurFade inView>
          <Panel
            id="papers"
            label="04 · Papers"
            question="Which experiments have the most published papers?"
            answer={papersAnswer()}
            note={`Titles listed under Publications on each NASA record. A paper listed on two records counts for both here, so the bars add up to more than ${totals.papers}.`}
          >
            <div className="grid grid-cols-1 gap-x-14 xl:grid-cols-2">
              <RankedBars rows={papers.slice(0, half)} max={most} lit={3} label="Published papers listed per experiment" />
              <RankedBars rows={papers.slice(half)} max={most} label="Published papers listed per experiment, continued" />
            </div>
          </Panel>
        </BlurFade>

        <details className="group relative border border-flame/20 bg-surface-1/80 backdrop-blur-md">
          <Brackets />
          <summary className="flex cursor-pointer flex-wrap items-baseline justify-between gap-x-6 gap-y-1 p-6 sm:px-8">
            <span className="text-xl font-semibold tracking-[-0.015em]">
              The full table: every question against all {totals.investigations} experiments
            </span>
            <span className="text-[15px] text-ink-muted">
              <span className="group-open:hidden">Show</span>
              <span className="hidden group-open:inline">Hide</span>
            </span>
          </summary>
          <div className="flex flex-col gap-6 border-t border-flame/15 p-6 sm:p-8">
            <p className="max-w-[44rem] text-[15px] leading-relaxed text-ink-muted">
              Each column is one experiment and each row one question. A mark means the experiment is
              listed as evidence for that question. Its shape is the strongest kind of quote it gives.
            </p>
            <KindLegend none="Not used for this question" />
            <CoverageMatrix />
          </div>
        </details>

        <nav aria-label="Where next" className="relative grid grid-cols-1 gap-px border border-flame/20 bg-flame/15 backdrop-blur-md sm:grid-cols-2">
          <Brackets />
          <Link href="/board" className="group flex flex-col gap-2 bg-surface-1/90 p-6 transition-colors duration-150 hover:bg-surface-2 sm:p-8">
            <span className="text-2xl font-semibold tracking-[-0.02em]">
              <span className="link-draw">Read the answers</span>
            </span>
            <span className="text-[15px] text-ink-muted">
              {totals.questions} fire-safety questions, each with its evidence ranked and quoted.
            </span>
          </Link>
          <Link href="/investigations" className="group flex flex-col gap-2 bg-surface-1/90 p-6 transition-colors duration-150 hover:bg-surface-2 sm:p-8">
            <span className="text-2xl font-semibold tracking-[-0.02em]">
              <span className="link-draw">Look up an experiment</span>
            </span>
            <span className="text-[15px] text-ink-muted">
              All {totals.investigations}, with what each one burned and under what conditions.
            </span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
