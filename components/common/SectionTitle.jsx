export default function SectionTitle({
  badge,
  title,
  text,
  align = "center",
}) {
  const isLeft = align === "left";

  return (
    <div
      className={`mb-10 flex flex-col ${
        isLeft ? "items-start text-left" : "items-center text-center"
      } sm:mb-12 lg:mb-14`}
    >
      {badge && (
        <div
          className={`inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/90 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-700 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur sm:px-4 sm:text-xs`}
        >
          <span className="h-2 w-2 rounded-full bg-teal-500" />
          <span className="truncate">{badge}</span>
        </div>
      )}

      <div className={`mt-4 ${isLeft ? "max-w-3xl" : "max-w-4xl"}`}>
        <h2 className="text-[2rem] font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </div>

      {text && (
        <div className={`mt-4 ${isLeft ? "max-w-2xl" : "max-w-3xl"}`}>
          <p className="text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8 lg:text-lg">
            {text}
          </p>
        </div>
      )}

      <div
        className={`mt-5 h-px w-full max-w-[140px] bg-gradient-to-r from-transparent via-teal-300 to-transparent ${
          isLeft ? "mr-auto" : "mx-auto"
        }`}
      />
    </div>
  );
}