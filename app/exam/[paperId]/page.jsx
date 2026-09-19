// app/exam/[paperId]/page.js
import ExamClient from "@/components/exam/ExamClient";
import questions from "@/src/data/questions";

export const dynamicParams = false;

export function generateStaticParams() {
  return questions.map((q) => ({ paperId: q.paperId }));
}

export default function Page() {
  return <ExamClient />;
}