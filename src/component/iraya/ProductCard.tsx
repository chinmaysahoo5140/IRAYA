import { Link } from "@tanstack/react-router";
import { formatINR } from "@/lib/format";

interface Props {
  slug: string;
  name: string;
  price: number | string;
  image: string | null;
  className?: string;
}

export function ProductCard({ slug, name, price, image, className = "" }: Props) {
  return (
    <Link to="/collection/$slug" params={{ slug }} className={`group block ${className}`}>
      <div className="overflow-hidden aspect-[4/5] bg-secondary hairline-b">
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            width={1024}
            height={1280}
            className="img-hover h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-secondary" />
        )}
      </div>
      <div className="mt-5 text-center">
        <div className="font-serif text-lg">{name}</div>
        <div className="mt-1 text-[12px] tracking-wide-2 text-mute">{formatINR(price)}</div>
      </div>
    </Link>
  );
}
