import fs from "fs";
import matter from "gray-matter";
import getPostMetadata from "@/components/getPostMetadata";
import PostContent from "@/components/PostContent";

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

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <PostContent post={post} />
      </div>
    </div>
  );
};

export default PostPage;