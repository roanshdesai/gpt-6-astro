// Shape of data/investigations.json (an array of 24 Investigation).
// Built by data/build/build_investigations.py from the saved PSI snapshot.
//
// Fields marked QUOTE are word for word from the investigation's PSI record,
// or the exact string "not stated". The build fails otherwise.

export type NotStated = "not stated";

export type Pillar = "prevent" | "detect" | "suppress";

export interface Investigation {
  /** PSI accession, e.g. "PSI-25". Stable key used by questions.json. */
  id: string;
  /** e.g. "BASS-II". null for the 5 ground studies, which have none: show `title`. */
  acronym: string | null;
  title: string;
  /** "ground" = Earth-based study that re-used flight data (5 of 24). */
  kind: "flight" | "ground";
  /** Can be empty: ACME E-FIELD (PSI-22) states no space application. */
  pillars: Pillar[];
  /** Two plain sentences. Written, not a quote. */
  summary: string;
  /** QUOTE: one objective sentence from the record. */
  objective: string;
  fuel: {
    state: "solid" | "liquid" | "gas" | "none" | NotStated;
    /** QUOTE: fuel type / shape. */
    detail: string;
    /** QUOTE: sample or droplet size. */
    size: string;
  };
  conditions: {
    oxygen: string; // QUOTE
    airflow: string; // QUOTE
    pressure: string; // QUOTE
  };
  /** What changed between tests. Written, not a quote. */
  varied: string;
  /** Short labels for what was measured. Written from the record. */
  measurements: string[];
  hardware: {
    /** QUOTE */
    apparatus: string;
    facility: "CIR" | "MSG" | "Cygnus" | "ground" | NotStated;
  };
  platform: "ISS" | "Cygnus" | "Ground" | NotStated;
  /** "2010-2022", "2010" (same year), "2017-" (no end date), or "not stated". */
  years: string;
  /** Other PSI ids, as listed in this record (not always listed both ways). */
  related: string[];
  /** Publication titles as PSI lists them. Can be empty. */
  publications: string[];
  /** https://psi.nasa.gov/physci/repo/investigation/<id> (pattern not yet confirmed). */
  psiUrl: string;
}
