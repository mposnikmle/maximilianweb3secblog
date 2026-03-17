"use client";

import { useState } from "react";
import Image from "next/image";
import { PostMetadata } from "@/lib/mdx";
import { BookCover } from "./BookCover";
import classes from "./Library.module.css";

interface LibraryProps {
  posts: PostMetadata[];
}

export function Library({ posts }: LibraryProps) {
  const [selectedCollection, setSelectedCollection] = useState<string>("All");

  // Get unique collections
  const collections = ["All", ...new Set(posts.map((p) => p.collection || "Uncategorized"))];

  // Filter posts by collection
  const filteredPosts =
    selectedCollection === "All"
      ? posts
      : posts.filter((p) => p.collection === selectedCollection);

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <div className={classes.logoContainer}>
          <Image
            src="/maxs-owl.PNG"
            alt="Max's Owl Logo"
            width={48}
            height={48}
            className={classes.logo}
            priority
          />
          <h1 className={classes.title}>Library</h1>
        </div>
        <div className={classes.collectionSelect}>
          <label htmlFor="collection">Collections</label>
          <select
            id="collection"
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className={classes.select}
          >
            {collections.map((collection) => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className={classes.grid}>
        {filteredPosts.map((post) => (
          <BookCover
            key={post.slug}
            slug={post.slug}
            title={post.title}
            author={post.author}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className={classes.empty}>
          <p>No posts in this collection yet.</p>
        </div>
      )}
    </div>
  );
}

