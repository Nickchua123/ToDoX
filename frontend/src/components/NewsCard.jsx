export default function NewsCard({ title, date, author, img, small = false }) {
  return (
    <div className={`bg-white rounded-2xl shadow-card overflow-hidden border ${small ? "grid grid-cols-[90px_1fr]" : ""}`}>
      <img src={img} alt={title} className={small ? "h-full w-[90px] object-cover" : "w-full h-48 object-cover"} />
      <div className="p-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span>{date}</span>
          <span>•</span>
          <span>{author}</span>
        </div>
        <div className="mt-1 text-sm font-semibold line-clamp-2">{title}</div>
      </div>
    </div>
  );
}

