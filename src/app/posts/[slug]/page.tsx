import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "@/components/getPostMetadata";
import { ReactNode, HTMLAttributes } from 'react';

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
  <h1 className="text-3xl font-bold mt-8 mb-4 text-slate-800" {...props}>
    {children}
  </h1>
);

const CustomH2 = ({ children, ...props }: CustomElementProps) => (
  <h2 className="text-2xl font-semibold mt-6 mb-3 text-slate-800" {...props}>
    {children}
  </h2>
);

const CustomP = ({ children, ...props }: CustomElementProps) => (
  <p className="my-4 leading-7 text-slate-600" {...props}>
    {children}
  </p>
);

const CustomBlockquote = ({ children, ...props }: CustomElementProps) => (
  <blockquote className="border-l-4 border-slate-300 pl-4 my-4 italic text-slate-600" {...props}>
    {children}
  </blockquote>
);

const CustomCode = ({ children, ...props }: CustomElementProps) => (
  <code className="bg-slate-100 rounded px-1 py-0.5 text-sm text-slate-800 font-mono" {...props}>
    {children}
  </code>
);

const CustomPre = ({ children, ...props }: CustomElementProps) => (
  <pre className="bg-slate-100 rounded-lg p-4 my-4 overflow-x-auto font-mono text-sm" {...props}>
    {children}
  </pre>
);

const CustomUl = ({ children, ...props }: CustomElementProps) => (
  <ul className="list-disc list-inside my-4 space-y-2 text-slate-600" {...props}>
    {children}
  </ul>
);

const CustomOl = ({ children, ...props }: CustomElementProps) => (
  <ol className="list-decimal list-inside my-4 space-y-2 text-slate-600" {...props}>
    {children}
  </ol>
);

const CustomLink = ({ children, ...props }: CustomElementProps & HTMLAttributes<HTMLAnchorElement>) => (
  <a className="text-blue-600 hover:text-blue-800 underline" {...props}>
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

const PostPage = ({ params }: PostPageProps) => {
  const slug = params.slug;
  const post = getPostContent(slug);

  const options = {
    overrides: {
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-200 text-center">
          <h1 className="text-3xl font-bold text-slate-800">{post.data.title}</h1>
          <p className="text-slate-500 mt-2">{post.data.date}</p>
          <div className="flex gap-2 justify-center mt-3">
            {post.data.tags?.split(',').map((tag: string) => (
              <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
        
        <article className="p-6 prose prose-slate max-w-none">
          <Markdown options={options}>{post.content}</Markdown>
        </article>
      </div>
    </div>
  );
};

export default PostPage;