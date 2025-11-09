export default function SectionHeading({ title, className = "", titleClassName = "" }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-8 ${className}`}>
      <span className="h-[2px] w-16 bg-brand-primary/70 rounded" />
      <h2 className={`text-2xl md:text-3xl font-semibold tracking-wide text-brand-dark ${titleClassName}`}>
        {title}
      </h2>
      <span className="h-[2px] w-16 bg-brand-primary/70 rounded" />
    </div>
  );
}
