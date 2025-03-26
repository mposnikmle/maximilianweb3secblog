import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "@/components/getPostMetadata";
import { ReactNode, HTMLAttributes } from 'react';
import Image from 'next/image';


// Define common props interface
interface CustomElementProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

// Custom components for markdown elements

// Add custom mark component
const CustomMark = ({ children, ...props }: CustomElementProps) => (
  <mark className="bg-myblue text-gray-900 px-1 rounded" {...props}>
    {children}
  </mark>
);

const CustomH1 = ({ children, ...props }: CustomElementProps) => (
  <h1 className="text-3xl font-bold mt-8 mb-4 text-white" {...props}>
    {children}
  </h1>
);

const CustomH2 = ({ children, ...props }: CustomElementProps) => (
  <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-200" {...props}>
    {children}
  </h2>
);

const CustomP = ({ children, ...props }: CustomElementProps) => (
  <p className="my-4 leading-7 text-gray-300" {...props}>
    {children}
  </p>
);

const CustomBlockquote = ({ children, ...props }: CustomElementProps) => (
  <blockquote className="border-l-4 border-blue-800 pl-4 my-4 italic text-gray-400" {...props}>
    {children}
  </blockquote>
);

// Custom component for inline code (`code` in Markdown)
const CustomCode = ({ children, ...props }: CustomElementProps) => (
  // Apply custom styles to make the code look like a code editor
  <code 
    style={{
      backgroundColor: '#1e3a8a',  // Deep blue background for inline code
      color: '#3abff8',            // Bright cyan-blue text
      padding: '2px 4px',          // Small padding around the text
      borderRadius: '4px',         // Slightly rounded corners
      fontFamily: 'monospace',     // Use a monospace font to replicate code editor style
      fontSize: '0.9em'            // Slightly smaller font size
    }}
    {...props}
  >
    {children}
  </code>
);

// Custom component for block code (`pre` in Markdown)
const CustomPre = ({ children, ...props }: CustomElementProps) => (
  // Use `pre` styling for block-level code (i.e., when using triple backticks ``` in Markdown)
  <pre 
    style={{
      backgroundColor: '#0f172a',  // Very dark blue-black background for block code
      color: '#38bdf8',            // Bright blue text
      padding: '10px',             // Larger padding for block-level code
      borderRadius: '6px',         // Rounded corners to match inline style
      fontFamily: 'monospace',     // Use a monospace font to match code editor look
      overflowX: 'auto'            // Enable horizontal scrolling for long code lines
    }}
    {...props}
  >
    {children}
  </pre>
);

const CustomUl = ({ children, ...props }: CustomElementProps) => (
  <ul className="list-disc list-inside my-4 space-y-2 text-gray-300" {...props}>
    {children}
  </ul>
);

const CustomOl = ({ children, ...props }: CustomElementProps) => (
  <ol className="list-decimal list-inside my-4 space-y-2 text-gray-300" {...props}>
    {children}
  </ol>
);

const CustomLink = ({ children, ...props }: CustomElementProps & HTMLAttributes<HTMLAnchorElement>) => (
  <a className="text-blue-400 hover:text-blue-300 underline" {...props}>
    {children}
  </a>
);

const getPostContent = (slug: string) => {
  const folder = "posts/";
  const file = `${folder}${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);
  return matterResult;
};

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  }));
};

interface PostPageProps {
  params: {
    slug: string;
  };
}

const CustomImage = ({ src, alt, ...props }: { src?: string; alt?: string }) => (
  <Image
    src={src || ''}
    alt={alt || 'Image'}
    width={800} // Default width
    height={200} // Default height
    style={{ objectFit: 'contain' }} // Adjust styling if needed
    {...props}
  />
);

const PostPage = ({ params }: PostPageProps) => {
  const slug = params.slug;
  const post = getPostContent(slug);

  const options = {
    overrides: {
      img: CustomImage,
      h1: CustomH1,
      h2: CustomH2,
      p: CustomP,
      blockquote: CustomBlockquote,
      code: CustomCode,
      pre: CustomPre,
      ul: CustomUl,
      ol: CustomOl,
      a: CustomLink,
      mark: CustomMark,
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-gray-900">
      <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 text-center">
          <h1 className="text-3xl font-bold text-white">{post.data.title}</h1>
          <p className="text-gray-400 mt-2">{post.data.date}</p>
          <div className="flex gap-2 justify-center mt-3">
            {post.data.tags?.split(',').map((tag: string) => (
              <span key={tag} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
        
        <article className="p-6 prose prose-invert max-w-none">
          <Markdown options={options}>{post.content}</Markdown>
        </article>
      </div>
    </div>
  );
};

export default PostPage;