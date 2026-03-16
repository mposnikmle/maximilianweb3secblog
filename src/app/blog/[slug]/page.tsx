import { Metadata } from "next";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import classes from "./page.module.css";
import { notFound } from "next/navigation";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 🎯 Generate SEO Metadata for each blog post
export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = getPostBySlug(slug);
    const ogImage = post.image
      ? `https://res.cloudinary.com/dl6exbzi2/image/upload/w_1200,h_630,c_fill,f_auto,q_auto/${post.image}`
      : "/og-default.png";

    return {
      title: post.title,
      description: post.description,
      keywords: post.keywords,
      authors: [{ name: post.author }],
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
        publishedTime: post.date,
        authors: [post.author],
        images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

// 🚀 Generate static paths at build time for all MDX files
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;

  try {
    // 1. Dynamically import the MDX file from your folder
    const { default: Post } = await import(`@/db/${slug}.mdx`);
    const post = getPostBySlug(slug);

    // 📊 JSON-LD Structured Data for Google Rich Results
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      image: post.image
        ? `https://res.cloudinary.com/dl6exbzi2/image/upload/${post.image}`
        : undefined,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        "@type": "Person",
        name: post.author,
      },
      publisher: {
        "@type": "Person",
        name: post.author,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://maximiliansecurity.xyz/blog/${slug}`,
      },
    };

    return (
      <>
        {/* JSON-LD for rich snippets in Google Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className={classes.page_wrapper}>
          <Link href="/" className={classes.back_button}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={classes.back_arrow}
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Library
          </Link>
          <article className={classes.blog_container}>
            {/* 2. Render the imported MDX file as a component */}
            <Post />
          </article>
        </div>
      </>
    );
  } catch (error) {
    // 3. If the file doesn't exist, show a 404
    notFound();
  }
}
