import getPostMetadata from "@/components/getPostMetadata";
import PostPreview from "@/components/PostPreview";

const BlogPage = () => {
  const postMetadata = getPostMetadata();
  const postPreviews = postMetadata.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">All Blog Posts</h1>
        <p className="text-gray-400">Browse all articles and research</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {postPreviews}
      </div>
    </div>
  );
}

export default BlogPage;