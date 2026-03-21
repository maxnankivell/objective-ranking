type ItemTileProps = {
  title: string;
  image?: string;
  className?: string;
};

export default function ItemTile({ title, image, className }: ItemTileProps) {
  return (
    <div
      className={[
        "group relative h-32 w-24 overflow-hidden rounded-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {image ? (
        <>
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-center text-xs font-bold text-white">
              {title}
            </span>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-neutral-200 p-1 dark:bg-neutral-800">
          <span className="text-center text-xs font-bold text-body">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
