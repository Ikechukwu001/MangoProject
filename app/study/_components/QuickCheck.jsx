"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";

export default function QuickCheck({ questions }) {
  const [picked, setPicked] = useState({});

  const total = questions.length;
  const answered = Object.keys(picked).length;
  const score = questions.reduce(
    (count, q, i) => (picked[i] === q.answer ? count + 1 : count),
    0
  );
  const finished = total > 0 && answered === total;

  if (total === 0) return null;

  return (
    <section aria-labelledby="quick-check" className="mt-14">
      <h2
        id="quick-check"
        className="text-2xl font-semibold tracking-tight text-stone-900"
      >
        Quick check
      </h2>
      <p className="mt-2 text-stone-600">
        Test yourself before you move on. Pick an answer to see the explanation.
      </p>

      <ol className="mt-6 space-y-6">
        {questions.map((q, qi) => {
          const options = Array.isArray(q.options) ? q.options : [];
          const chosen = picked[qi];
          const hasAnswered = chosen !== undefined;

          return (
            <li
              key={qi}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <p className="font-medium text-stone-900">
                <span className="mr-2 text-teal-700">{qi + 1}.</span>
                {q.question}
              </p>

              <div className="mt-4 grid gap-2">
                {options.map((option, oi) => {
                  const isCorrect = oi === q.answer;
                  const isChosen = oi === chosen;

                  let style =
                    "border-stone-200 bg-white text-stone-800 hover:border-teal-400 hover:bg-teal-50";
                  if (hasAnswered) {
                    if (isCorrect) {
                      style =
                        "border-emerald-500 bg-emerald-50 text-emerald-900";
                    } else if (isChosen) {
                      style = "border-red-400 bg-red-50 text-red-900";
                    } else {
                      style = "border-stone-200 bg-white text-stone-400";
                    }
                  }

                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() =>
                        setPicked((prev) => ({ ...prev, [qi]: oi }))
                      }
                      className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${style}`}
                    >
                      <span>{option}</span>
                      {hasAnswered && isCorrect && (
                        <CircleCheck
                          className="h-4 w-4 shrink-0 text-emerald-600"
                          aria-label="Correct answer"
                        />
                      )}
                      {hasAnswered && isChosen && !isCorrect && (
                        <CircleX
                          className="h-4 w-4 shrink-0 text-red-500"
                          aria-label="Your answer"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && q.explanation && (
                <p className="mt-4 rounded-lg bg-stone-50 p-3 text-sm leading-6 text-stone-700">
                  <span className="font-semibold text-stone-900">Why: </span>
                  {q.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {finished && (
        <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-6">
          <p className="text-lg font-semibold text-teal-900">
            You scored {score} out of {total}
          </p>
          <p className="mt-1 text-sm text-teal-900/80">
            {score === total
              ? "Excellent. You are ready for the next lesson."
              : "Read the explanations above, then try again to lock it in."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setPicked({})}
              className="inline-flex items-center gap-2 rounded-lg border border-teal-300 bg-white px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-100"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
            <Link
              href="/papers"
              className="inline-flex items-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              Practise more questions
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
