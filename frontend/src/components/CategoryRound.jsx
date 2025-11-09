export default function CategoryRound({ label, img }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-card overflow-hidden ring-1 ring-black/5">
        <img className="w-full h-full object-cover" src={img} alt={label} />
      </div>
      <span className="text-[13px] md:text-sm font-medium">{label}</span>
    </div>
  );
}
