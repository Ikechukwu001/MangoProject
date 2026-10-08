import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Styles for every markdown element a lesson can contain.
// Edit these classes to change how all lessons look.
const components = {
  h2: ({ node, ...props }) => (
    <h2
      className="mt-12 mb-4 border-b border-stone-200 pb-2 text-2xl font-semibold tracking-tight text-stone-900"
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="mt-8 mb-3 text-xl font-semibold text-stone-900"
      {...props}
    />
  ),
  p: ({ node, ...props }) => (
    <p className="my-4 text-base leading-7 text-stone-700" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul
      className="my-4 list-disc space-y-2 pl-6 text-base leading-7 text-stone-700 marker:text-teal-600"
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      className="my-4 list-decimal space-y-2 pl-6 text-base leading-7 text-stone-700 marker:font-semibold marker:text-teal-700"
      {...props}
    />
  ),
  li: ({ node, ...props }) => <li className="pl-1" {...props} />,
  strong: ({ node, ...props }) => (
    <strong className="font-semibold text-stone-900" {...props} />
  ),
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="my-6 border-l-4 border-teal-500 bg-teal-50 px-5 py-3 text-stone-700"
      {...props}
    />
  ),
  hr: ({ node, ...props }) => (
    <hr className="my-10 border-stone-200" {...props} />
  ),
  a: ({ node, href, ...props }) => {
    const external = typeof href === "string" && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-900"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      />
    );
  },
  // Inline code, for short terms inside a sentence.
  code: ({ node, ...props }) => (
    <code
      className="rounded bg-stone-100 px-1.5 py-0.5 text-sm text-stone-800"
      {...props}
    />
  ),
  // Fenced code blocks (used for sample prescriptions and labels).
  // The [&_code] classes remove the inline-code styling inside the box.
  pre: ({ node, ...props }) => (
    <pre
      className="my-6 overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-stone-200 bg-stone-100 p-4 text-sm leading-6 text-stone-800 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-sm"
      {...props}
    />
  ),
  table: ({ node, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-stone-100" {...props} />,
  th: ({ node, ...props }) => (
    <th
      className="border-b border-stone-200 px-4 py-3 font-semibold text-stone-900"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      className="border-b border-stone-100 px-4 py-3 align-top text-stone-700"
      {...props}
    />
  ),
};

export default function GuideBody({ content }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
