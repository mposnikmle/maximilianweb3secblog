import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import python from 'highlight.js/lib/languages/python';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Optionally provide any and all other Next.js config options here
  reactStrictMode: true,
  swcMinify: true,
};

const withMDX = createMDX({
  // Add markdown plugins here, if needed
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypeHighlight,
        {
          // Add the Python language definition
          languages: {
            python,
          },
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
