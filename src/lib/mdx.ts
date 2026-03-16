import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dbPath = path.join(process.cwd(), 'src/db');

export interface PostMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image?: string;
  keywords?: string;
  collection?: string;
  progress?: number; // Reading progress percentage
}

export function getAllPosts(): PostMetadata[] {
  const files = fs.readdirSync(dbPath).filter(f => f.endsWith('.mdx'));
  
  return files.map(file => {
    const slug = file.replace('.mdx', '');
    const content = fs.readFileSync(path.join(dbPath, file), 'utf8');
    const { data } = matter(content);
    
    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'Anonymous',
      image: data.image,
      keywords: data.keywords,
      collection: data.collection || 'Uncategorized',
      progress: data.progress || 0,
    };
  });
}

export function getPostBySlug(slug: string): PostMetadata {
  try {
    const content = fs.readFileSync(path.join(dbPath, `${slug}.mdx`), 'utf8');
    const { data } = matter(content);
    
    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'Anonymous',
      image: data.image,
      keywords: data.keywords,
      collection: data.collection || 'Uncategorized',
      progress: data.progress || 0,
    };
  } catch (error) {
    throw new Error(`Post not found: ${slug}`);
  }
}

