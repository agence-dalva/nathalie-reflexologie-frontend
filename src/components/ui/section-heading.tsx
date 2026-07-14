export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
}) {
  const titleColor = tone === "light" ? "text-cream" : "text-sage-900";
  const descColor = tone === "light" ? "text-sage-100" : "text-stone-500";

  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading
        className={`mt-5 font-display text-[2rem] leading-[1.15] font-light sm:text-4xl md:text-[2.75rem] ${titleColor}`}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={`mt-5 max-w-xl text-[0.98rem] leading-relaxed ${descColor} ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
