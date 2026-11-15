import { NextResponse, type NextRequest } from "next/server";
import investigations from "../data/investigations.json";

// Unknown investigation ids answer 404, not 200.
// With Cache Components the page sends its static shell (status 200) before
// notFound() runs, so the check has to happen here, before rendering starts.
// See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md "Status codes".
const IDS = new Set((investigations as { id: string }[]).map((i) => i.id));

export function proxy(request: NextRequest) {
  const id = decodeURIComponent(request.nextUrl.pathname.split("/")[2] ?? "");
  if (IDS.has(id)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
}

export const config = {
  matcher: "/investigations/:id",
};
