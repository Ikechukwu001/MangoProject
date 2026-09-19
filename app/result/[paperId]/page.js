// app/result/[paperId]/page.jsx
import ResultClient from "@/components/results/ResultClient";
import questions from "@/src/data/questions";

export const dynamicParams = false;

export function generateStaticParams() {
  return questions.map((q) => ({ paperId: q.paperId }));
}

export default function Page() {
  return <ResultClient />;
}