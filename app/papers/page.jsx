import PapersClient from "@/components/papers/PapersClient";

// No cookies()/auth on the server anymore, so this route can be statically
// generated and served from cache instead of running a function per visit.
// PapersClient now handles its own auth check + redirect client-side.
export const revalidate = 3600;

export default function PapersPage() {
  return <PapersClient />;
}