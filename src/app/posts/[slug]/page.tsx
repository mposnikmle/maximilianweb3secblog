import fs from "fs";
import matter from "gray-matter";
import path from "path";
import getPostMetadata from "@/components/getPostMetadata";
import PostContent from "@/components/MDXComponents";
import { processMarkdown } from "@/lib/markdown";

const getPostContent = async (slug: string) => {
  try {
    const folder = path.join(process.cwd(), "posts");
    
    // Try to find the markdown file by matching the slug
    const files = fs.readdirSync(folder);
    const markdownFiles = files.filter((file) => file.endsWith("md"));
    
    // Find the file that matches the slug (after URL-friendly conversion)
    const matchingFile = markdownFiles.find(file => {
      const fileSlug = file.replace(".md", "").replace(/\s+/g, "-").toLowerCase();
      return fileSlug === slug;
    });
    
    if (matchingFile) {
      const fileContents = fs.readFileSync(path.join(folder, matchingFile), "utf8");
      const { data, content } = matter(fileContents);
      
      // Process the markdown content through rehype for syntax highlighting
      const processedContent = await processMarkdown(fileContents);
      
      return { data, content: processedContent };
    }
    
    throw new Error(`Post not found: ${slug}`);
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    throw new Error(`Post not found: ${slug}`);
  }
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

const PostPage = async ({ params }: PostPageProps) => {
  const slug = params.slug;
  
  try {
    const post = await getPostContent(slug);

    // Extract only serializable data
    const serializablePost = {
      content: post.content,
      data: {
        title: post.data.title,
        date: post.data.date,
        subtitle: post.data.subtitle,
        tags: post.data.tags
      }
    };

    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <PostContent post={serializablePost} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h1>
            <p className="text-gray-600">The post "{slug}" could not be found.</p>
          </div>
        </div>
      </div>
    );
  }
};

export default PostPage;