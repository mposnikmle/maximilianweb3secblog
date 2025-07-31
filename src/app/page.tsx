import Link from "next/link";
import getPostMetadata from "@/components/getPostMetadata";
import PostPreview from "@/components/PostPreview";
import Footer from "@/components/Footer";

const HomePage = () => {
  try {
    const postMetadata = getPostMetadata();
    const postPreviews = postMetadata.map((post) => (
      <PostPreview key={post.slug} {...post} />
    ));

    return (
      <div className="p-6 flex flex-col min-h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {postPreviews}
        </div>
        
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error loading home page:", error);
    return (
      <div className="p-6 flex flex-col min-h-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Posts</h1>
          <p className="text-gray-600">There was an error loading the blog posts.</p>
        </div>
        <Footer />
      </div>
    );
  }
}

export default HomePage;