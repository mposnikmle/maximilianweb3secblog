import fs from "fs";
import matter from "gray-matter";
import path from "path";
import getPostMetadata from "@/components/getPostMetadata";
import PostContent from "@/components/PostContent";

const getPostContent = (slug: string) => {
  try {
    const folder = path.join(process.cwd(), "posts");
    
    // Try markdown file first
    const mdFile = path.join(folder, `${slug}.md`);
    if (fs.existsSync(mdFile)) {
      const content = fs.readFileSync(mdFile, "utf8");
      const matterResult = matter(content);
      return { ...matterResult, type: "markdown" };
    }
    
    // Try PDF file - look for the specific PDF file
    const pdfFile = path.join(folder, "July-31-2025_NumPy_basics.pdf");
    if (fs.existsSync(pdfFile)) {
      return {
        content: `<iframe src="/posts/july-31-2025-numpy-basics.pdf" width="100%" height="800px" style="border: none;"></iframe>`,
        data: {
          title: "NumPy Basics",
          date: "2025-07-31",
          subtitle: "Intro to NumPy arrays",
          tags: "#Python #ML/Data Science #NumPy"
        },
        type: "pdf"
      };
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

const PostPage = ({ params }: PostPageProps) => {
  const slug = params.slug;
  
  try {
    const post = getPostContent(slug);

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