"use client";

import { useState, ReactNode, HTMLAttributes } from 'react';
import Markdown from "markdown-to-jsx";
import Image from 'next/image';
import ThemeToggle from "@/components/ThemeToggle";

interface PostContentProps {
  post: any;
}

// Define common props interface
interface CustomElementProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  theme?: 'light' | 'dark';
}

// Custom components for markdown elements
const CustomMark = ({ children, theme = 'dark', ...props }: CustomElementProps) => (
  <mark className={`px-1 rounded ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-gray-900'}`} {...props}>
    {children}
  </mark>
);

const CustomH1 = ({ children, theme = 'dark', ...props }: CustomElementProps) => (
  <h1 className={`text-3xl font-bold mt-8 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} {...props}>
    {children}
  </h1>
);

const CustomH2 = ({ children, theme = 'dark', ...props }: CustomElementProps) => (
  <h2 className={`text-2xl font-semibold mt-6 mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`} {...props}>
    {children}
  </h2>
);

const CustomP = ({ children, theme = 'dark', ...props }: CustomElementProps) => (
  <p className={`my-4 leading-7 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} {...props}>
    {children}
  </p>
);

const CustomBlockquote = ({ children, theme = 'dark', ...props }: CustomElementProps) => (
  <blockquote className={`border-l-4 pl-4 my-4 italic ${theme === 'dark' ? 'border-blue-800 text-gray-400' : 'border-blue-400 text-gray-600'}`} {...props}>
    {children}
  </blockquote>
);

const CustomCode = ({ children, theme = 'dark', ...props }: CustomElementProps) => (
  <code 
    style={{
      backgroundColor: theme === 'dark' ? '#1e3a8a' : '#e0e7ff',
      color: theme === 'dark' ? '#3abff8' : '#1e40af',
      padding: '2px 4px',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '0.9em'
    }}
    {...props}
  >
    {children}
  </code>
);

const CustomPre = ({ children, theme = 'dark', ...props }: CustomElementProps) => (
  <pre 
    style={{
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
      color: theme === 'dark' ? '#38bdf8' : '#1e40af',
      padding: '10px',
      borderRadius: '6px',
      fontFamily: 'monospace',
      overflowX: 'auto',
      border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0'
    }}
    {...props}
  >
    {children}
  </pre>
);

const CustomUl = ({ children, theme = 'dark', ...props }: CustomElementProps) => (
  <ul className={`list-disc list-inside my-4 space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} {...props}>
    {children}
  </ul>
);

const CustomOl = ({ children, theme = 'dark', ...props }: CustomElementProps) => (
  <ol className={`list-decimal list-inside my-4 space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} {...props}>
    {children}
  </ol>
);

const CustomLink = ({ children, theme = 'dark', ...props }: CustomElementProps & HTMLAttributes<HTMLAnchorElement>) => (
  <a className={`underline ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`} {...props}>
    {children}
  </a>
);

const CustomImage = ({ src, alt, ...props }: { src?: string; alt?: string }) => (
  <Image
    src={src || ''}
    alt={alt || 'Image'}
    width={800}
    height={200}
    style={{ objectFit: 'contain' }}
    {...props}
  />
);

const PostContent = ({ post }: PostContentProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  // Create theme-aware options
  const options = {
    overrides: {
      img: CustomImage,
      h1: (props: any) => <CustomH1 {...props} theme={theme} />,
      h2: (props: any) => <CustomH2 {...props} theme={theme} />,
      p: (props: any) => <CustomP {...props} theme={theme} />,
      blockquote: (props: any) => <CustomBlockquote {...props} theme={theme} />,
      code: (props: any) => <CustomCode {...props} theme={theme} />,
      pre: (props: any) => <CustomPre {...props} theme={theme} />,
      ul: (props: any) => <CustomUl {...props} theme={theme} />,
      ol: (props: any) => <CustomOl {...props} theme={theme} />,
      a: (props: any) => <CustomLink {...props} theme={theme} />,
      mark: (props: any) => <CustomMark {...props} theme={theme} />,
    },
  };

  return (
    <div className={`rounded-lg shadow-2xl overflow-hidden transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
    }`}>
      <div className={`p-6 border-b text-center ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <ThemeToggle onThemeChange={handleThemeChange} currentTheme={theme} />
        </div>
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {post.data.title}
        </h1>
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {post.data.date}
        </p>
        <div className="flex gap-2 justify-center mt-3">
          {post.data.tags?.split(',').map((tag: string) => (
            <span key={tag} className={`px-3 py-1 rounded-full text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 text-gray-200' 
                : 'bg-gray-200 text-gray-700'
            }`}>
              {tag.trim()}
            </span>
          ))}
        </div>
      </div>
      
      <article className={`p-6 prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
        <Markdown options={options}>{post.content}</Markdown>
      </article>
    </div>
  );
};

export default PostContent; 