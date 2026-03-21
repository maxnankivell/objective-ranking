import Image from "next/image";

type ItemTileProps = {
  title: string;
  image?: string;
  className?: string;
  onDelete?: (title: string) => void;
};

export default function ItemTile({
  title,
  image,
  className,
  onDelete,
}: ItemTileProps) {
  return (
    <div
      className={[
        "group relative h-32 w-24 overflow-hidden rounded-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {onDelete ? (
        <button
          type="button"
          aria-label={`Remove ${title}`}
          className="absolute top-1 right-1 z-20 flex size-6 cursor-pointer items-center justify-center rounded-full bg-red-600 opacity-0 shadow-sm transition-opacity pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(title);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            className="size-3.5 text-white"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M2.22 2.22a.75.75 0 0 1 1.06 0L6 4.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L7.06 6l2.72 2.72a.75.75 0 1 1-1.06 1.06L6 7.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L4.94 6 2.22 3.28a.75.75 0 0 1 0-1.06Z"
            />
          </svg>
        </button>
      ) : null}
      {image ? (
        <>
          <Image src={image} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 grid place-items-center overflow-hidden bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="line-clamp-6 max-h-full max-w-full w-full min-w-0 self-center wrap-break-word text-center text-sm leading-snug font-bold text-white">
              {title}
            </span>
          </div>
        </>
      ) : (
        <div className="grid h-full w-full place-items-center overflow-hidden bg-neutral-200 p-1 dark:bg-neutral-800">
          <span className="line-clamp-6 max-h-full max-w-full w-full min-w-0 self-center wrap-break-word text-center text-sm leading-snug font-bold text-body">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
