import { Link } from "react-router-dom";

export default function CategoryRound({ label, img, slug }) {
  const content = (
    <>
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-card overflow-hidden ring-1 ring-black/5">
        <img className="w-full h-full object-cover" src={img} alt={label} />
      </div>
      <span className="text-[13px] md:text-sm font-medium text-center">{label}</span>
    </>
  );

  if (slug) {
    return (
      <Link
        to={`/category?slug=${slug}`}
        className="flex flex-col items-center gap-3 hover:text-brand-primary transition"
      >
        {content}
      </Link>
    );
  }

  return <div className="flex flex-col items-center gap-3">{content}</div>;
}
