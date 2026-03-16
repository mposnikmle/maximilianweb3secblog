"use client";

import { CldImage } from "next-cloudinary";
import React from "react";
import classes from "./CloudinaryImage.module.css";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  priority?: boolean;
  sizes?: string;
  crop?: "fill" | "fit" | "scale" | "thumb" | "auto";
}

/**
 * CloudinaryImage component for optimized image delivery in MDX blog posts
 * Automatically generates responsive srcset like professional sites (Slate, Medium, etc.)
 * 
 * @param src - Cloudinary public ID or full URL
 * @param alt - Alt text for accessibility and SEO
 * @param width - Image width (default: 800)
 * @param height - Image height (default: 600)
 * @param caption - Optional caption displayed below the image
 * @param priority - Set to true for above-the-fold images (LCP optimization)
 * @param sizes - Custom sizes attribute for responsive images (defaults to responsive)
 * @param crop - Cropping mode: "fill", "fit", "scale", "thumb", or "auto" (default: "fill")
 */
export function CloudinaryImage({
  src,
  alt,
  width = 800,
  height = 600,
  caption,
  priority = false,
  sizes,
  crop = "fill",
}: CloudinaryImageProps) {
  // Professional responsive sizes (like Slate, Medium, NYT)
  // Matches multiple breakpoints for optimal loading
  const defaultSizes = 
    "(min-width: 1440px) 970px, " +
    "(min-width: 1024px) 709px, " +
    "(min-width: 768px) 620px, " +
    "calc(100vw - 30px)";

  return (
    <figure className={classes.figure}>
      <CldImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes || defaultSizes}
        className={classes.image}
        priority={priority}
        crop={crop}
        // SEO and performance optimizations
        // Cloudinary automatically generates srcset with multiple widths:
        // 320w, 480w, 600w, 840w, 960w, 1280w, 1440w, 1600w, 1920w, 2200w
        format="auto"
        quality="auto"
        loading={priority ? "eager" : "lazy"}
      />
      {caption && <figcaption className={classes.caption}>{caption}</figcaption>}
    </figure>
  );
}

