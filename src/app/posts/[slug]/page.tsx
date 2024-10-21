import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "@/components/getPostMetadata";

const getPostContent = (slug: string) => {
    const folder = "posts/";
    const file = `${folder}${slug}.md`
    const content = fs.readFileSync(file, "utf8");
    const matterResult = matter(content);
    return matterResult
}

export const generateStaticParams = async () => {
    const posts = getPostMetadata();
    return posts.map((post) => ({
        slug: post.slug
    }))
}

const PostPage = (props: any) => {
    const slug = props.params.slug;
    const post = getPostContent(slug);
    return (
        <div className="flex flex-col items-center justify-center mb-12">
        <div className="my-8 text-center">
          <h1 className="text-2xl text-slate-600 ">{post.data.title}</h1>
          <p className="text-slate-400 mt-2">{post.data.date}</p>
          <p className="text-slate-400 mt-2">{post.data.tags}</p>
        </div>
  
        <article className="prose bg-white pl-2 pr-2">
          <Markdown>{post.content}</Markdown>
        </article>
      </div>
    );
};

export default PostPage;