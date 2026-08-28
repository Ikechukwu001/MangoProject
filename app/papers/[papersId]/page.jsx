import getPaperById from "@/lib/getPaperById";
import PaperDetailsClient from "@/components/papers/PaperDetailsClient";

// This page no longer touches cookies/auth on the server, so Next.js can
// statically generate it (and cache it) instead of running a function on
// every single visit. Auth-dependent UI (premium status, start button,
// redirect-if-logged-out) now lives in the client component below.
export const revalidate = 3600; // re-generate at most once per hour

export default async function PaperDetailsPage({ params }) {
  const { paperId } = params;
  const paper = getPaperById(paperId);

  return <PaperDetailsClient paper={paper} />;
}