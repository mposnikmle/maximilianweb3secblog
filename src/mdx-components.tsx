import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { highlight } from "sugar-high";
import { Pre } from "./components/mdx/Pre";
import { CloudinaryImage } from "./components/mdx/CloudinaryImage";
import { AnnotatedCode, Annotation } from "./components/mdx/AnnotatedCode";
import classes from "./mdx-components.module.css";

type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;

const components = {
  h1: (props: HeadingProps) => <h1 className={classes.h1} {...props} />,
  h2: (props: HeadingProps) => <h2 className={classes.h2} {...props} />,
  h3: (props: HeadingProps) => <h3 className={classes.h3} {...props} />,
  h4: (props: HeadingProps) => <h4 className={classes.h4} {...props} />,
  p: (props: ParagraphProps) => <p className={classes.p} {...props} />,
  ol: (props: ListProps) => <ol className={classes.ol} {...props} />,
  ul: (props: ListProps) => <ul className={classes.ul} {...props} />,
  li: (props: ListItemProps) => <li className={classes.li} {...props} />,
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className={classes.em} {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className={classes.strong} {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={classes.link} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={classes.link} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes.link}
        {...props}
      >
        {children}
      </a>
    );
  },
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => {
    // Don't use dangerouslySetInnerHTML - render children directly to preserve backslashes
    return (
      <code
        className={classes.code}
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: (props: BlockquoteProps) => (
    <blockquote className={classes.blockquote} {...props} />
  ),
  pre: Pre,
  CloudinaryImage,
  AnnotatedCode,
  Annotation,
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}
