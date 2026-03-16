import { getAllPosts } from "@/lib/mdx";
import { Library } from "@/components/Library";

export default function Home() {
  const posts = getAllPosts();

  return <Library posts={posts} />;
}
