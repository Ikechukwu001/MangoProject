// app/papers/[papersId]/page.jsx
import getPaperById from "@/lib/getPaperById";
import PaperDetailsClient from "@/components/papers/PaperDetailsClient";
import questions from "@/src/data/questions";

export const dynamicParams = false; // unknown IDs return 404 without running a function

export function generateStaticParams() {
  return questions.map((q) => ({ papersId: q.paperId }));
}

export default async function PaperDetailsPage({ params }) {
  const { papersId } = await params;
  const paper = getPaperById(papersId);
  return <PaperDetailsClient paper={paper} />;
}