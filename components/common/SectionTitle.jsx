export default function SectionTitle({
  badge,
  title,
  text,
  align = "center",
}) {
  const alignment =
    align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <div className={`mb-12 flex flex-col ${alignment}`}>
      {badge && (
        <span className="mb-4 inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
          {badge}
        </span>
      )}

      <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>

      {text && (
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          {text}
        </p>
      )}
    </div>
  );
}