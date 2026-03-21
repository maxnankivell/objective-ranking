import Image from "next/image";

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
