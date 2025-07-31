import getPostMetadata from "@/components/getPostMetadata";
import PostPreview from "@/components/PostPreview";

const BlogPage = () => {
  try {
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
  } catch (error) {
    console.error("Error loading blog page:", error);
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Blog</h1>
          <p className="text-gray-600">There was an error loading the blog posts.</p>
        </div>
      </div>
    );
  }
}

export default BlogPage;