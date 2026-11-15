// Shape of data/landing.json: the landing's incident cards and video link.
// Built by data/build/build_landing.py from data/build/landing_src.py (backend part 6).
// Every quote and support line is checked word for word against a saved copy
// of its NASA page; the build fails otherwise. Not ranked evidence.
//
//   import raw from "@/../data/landing.json";
//   const landing = raw as Landing;

export interface Incident {
  id: "apollo-1" | "mir" | string;
  year: string;
  name: string;
  /** One or two plain sentences for the card. Written, backed by quote + support. */
  text: string;
  /** NASA's own words, word for word, for a "from NASA" line or tooltip. */
  quote: string;
  /** URL of the NASA page the quote is from. */
  source: string;
  /** Short label for the source link. */
  sourceTitle: string;
  /** More word-for-word lines from the same page that back the facts in `text`.
   *  For the check and for reviewers; the UI need not show them. */
  support: string[];
}

export interface LandingVideo {
  title: string;
  /** The video itself (YouTube), as linked from NASA's challenge page. */
  url: string;
  /** The video's page in the NASA Image and Video Library. */
  nasaUrl: string;
  /** NASA's description of the video, word for word. */
  quote: string;
  /** The library's record file for the video, which the quote is checked against. */
  source: string;
  sourceTitle: string;
}

export interface Landing {
  incidents: Incident[];
  video: LandingVideo;
}
