import cn from "classnames";
import Link from "next/link";
import Image from "next/image";

type Props = {
  title: string;
  src: string;
  slug?: string;
  priority?: boolean;
};

const CoverImage = ({ title, src, slug, priority }: Props) => {
  const image = (
    <div className="relative w-full aspect-[2/1]">
      <Image
        src={src}
        alt={title}
        fill
        sizes="(min-width: 1024px) 1300px, 100vw"
        className={cn("object-cover", {
          "hover:shadow-lg transition-shadow duration-200": slug,
        })}
        priority={priority}
      />
    </div>
  );
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]" aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
