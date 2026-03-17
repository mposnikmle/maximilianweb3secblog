import Link from "next/link";
import { generateGradient } from "@/lib/gradientGenerator";
import { FractalCover } from "./FractalCover";
import classes from "./BookCover.module.css";

interface BookCoverProps {
  slug: string;
  title: string;
  author: string;
  progress?: number;
}

export function BookCover({ slug, title, author }: BookCoverProps) {
  const gradient = generateGradient(title);

  return (
    <Link href={`/blog/${slug}`} className={classes.bookWrapper}>
      <div className={classes.bookCover} style={{ background: gradient }}>
        <FractalCover seed={title} className={classes.canvas} />
        <div className={classes.bookContent}>
          <h3 className={classes.title}>{title}</h3>
        </div>
      </div>
    </Link>
  );
}

