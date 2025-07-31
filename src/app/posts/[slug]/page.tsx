import fs from "fs";
import matter from "gray-matter";
import path from "path";
import getPostMetadata from "@/components/getPostMetadata";
import PostContent from "@/components/PostContent";

const getPostContent = (slug: string) => {
  try {
    const folder = path.join(process.cwd(), "posts");
    const file = path.join(folder, `${slug}.md`);
    const content = fs.readFileSync(file, "utf8");
    const matterResult = matter(content);
    return matterResult;
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

    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <PostContent post={post} />
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