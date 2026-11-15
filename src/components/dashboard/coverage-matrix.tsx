import Link from "next/link";
import { Fragment } from "react";

import { PILLARS } from "@/lib/data";
import { coverage, coverageColumns } from "@/lib/stats";

import { KIND_LABEL, KindMark } from "./kind-mark";

const GROUPS = [...PILLARS.map((pillar) => ({ id: pillar.id as string, name: pillar.name })), { id: "across", name: "Across all three" }];

/**
 * Every question against every investigation. A mark means the investigation
 * is listed as evidence for the question; its shape is the strongest kind of
 * quote it gives. It is a real
 * table, so it reads the same to a screen reader as it does on screen.
 */
export function CoverageMatrix() {
  const columns = coverageColumns;

  return (
    <div className="max-xl:overflow-x-auto">
      <table className="w-full min-w-[60rem] table-fixed border-collapse">
        <colgroup>
          <col className="w-[11.5rem] sm:w-[19rem]" />
          {columns.map((column) => (
            <col key={column.id} />
          ))}
          <col className="w-[10.5rem]" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="pb-3 text-left align-bottom font-mono text-[11px] font-normal text-ink-subtle">
              Question
            </th>
            {columns.map((column) => (
              <th key={column.id} scope="col" className="h-40 pb-3 align-bottom font-normal">
                <span
                  title={column.title}
                  className="mx-auto block max-h-36 w-fit rotate-180 overflow-hidden whitespace-nowrap font-mono text-[11px] text-ink-muted [writing-mode:vertical-rl]"
                >
                  {column.name}
                </span>
              </th>
            ))}
            <th scope="col" className="pb-3 pl-4 text-left align-bottom font-mono text-[11px] font-normal text-ink-subtle">
              Experiments
            </th>
          </tr>
        </thead>
        <tbody>
          {GROUPS.map((group) => {
            const rows = coverage.filter((row) => row.question.pillar === group.id);
            if (rows.length === 0) return null;
            return (
              <Fragment key={group.id}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={columns.length + 2}
                    className="border-t border-hairline-strong pb-1 pt-3 text-left font-mono text-[11px] font-normal text-ink-subtle"
                  >
                    {group.name}
                  </th>
                </tr>
                {rows.map((row) => {
                  const found = [...row.cells.values()].filter((kind) => kind === "found").length;
                  return (
                    <tr key={row.question.id} className="transition-colors duration-150 hover:bg-surface-2/70">
                      <th
                        scope="row"
                        className="py-1.5 pr-4 text-left text-[15px] font-medium leading-tight max-xl:sticky max-xl:left-0 max-xl:z-10 max-xl:bg-surface-1"
                      >
                        <Link href={`/board/${row.question.id}`} className="link-draw">
                          {row.question.question}
                        </Link>
                      </th>
                      {columns.map((column) => {
                        const kind = row.cells.get(column.id);
                        if (!kind) {
                          return (
                            <td key={column.id} className="p-0">
                              <span aria-hidden className="mx-auto block size-1 rounded-full bg-hairline-strong/70" />
                            </td>
                          );
                        }
                        const label = `${column.name}: ${KIND_LABEL[kind].toLowerCase()}`;
                        const href = `/board/${row.question.id}#${column.id}`;
                        return (
                          <td key={column.id} className="p-0">
                            <Link
                              href={href}
                              className="group/cell relative flex h-8 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
                            >
                              <KindMark
                                kind={kind}
                                className="transition-transform duration-150 group-hover/cell:scale-125"
                              />
                              <span className="sr-only">{label}</span>
                              <span
                                aria-hidden
                                className="pointer-events-none absolute bottom-full left-1/2 z-30 hidden -translate-x-1/2 whitespace-nowrap border border-hairline-strong bg-canvas px-2 py-1 font-mono text-[11px] text-ink group-hover/cell:block group-focus-visible/cell:block"
                              >
                                {label}
                              </span>
                            </Link>
                          </td>
                        );
                      })}
                      <td className="whitespace-nowrap pl-4 font-mono text-[12px] tabular-nums text-ink-muted">
                        <span className="text-ink">{row.cells.size}</span> of {columns.length}
                        {found > 0 && <span className="pl-2 text-ink">· {found} found</span>}
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
