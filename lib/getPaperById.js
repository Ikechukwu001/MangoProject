import papers from "@/data/papers";

export default function getPaperById(paperId) {
  return papers.find((paper) => paper.id === paperId);
}