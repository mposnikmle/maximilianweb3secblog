import Link from "next/link";
import getPostMetadata from "@/components/getPostMetadata";
import PostPreview from "@/components/PostPreview";

const HomePage = () => {
  const postMetadata = getPostMetadata();
  const postPreviews = postMetadata.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));

  return <>
    <h1 className="text-4xl font-bold text-center mt-2">Web3 Security Blog</h1>
    <div className="mt-3 ml-3 mr-3 mb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {postPreviews}

    </div>
  </>
}

export default HomePage;