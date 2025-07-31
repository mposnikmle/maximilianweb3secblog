import getPostMetadata from "@/components/getPostMetadata";
import PostPreview from "@/components/PostPreview";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const CategoryPage = ({ params }: CategoryPageProps) => {
  const { slug } = params;
  
  // Define category mappings
  const categoryMappings: { [key: string]: string[] } = {
    "web3-security": ["introtoanchor", "lowlevelcalls"],
    "ml-data-science": []
  };

  const categoryNames: { [key: string]: string } = {
    "web3-security": "Web3 Security",
    "ml-data-science": "ML/Data Science"
  };

  const categoryIcons: { [key: string]: string } = {
    "web3-security": "🔐",
    "ml-data-science": "⚙️"
  };

  if (!categoryMappings[slug]) {
    notFound();
  }

  try {
    const allPosts = getPostMetadata();
    const categoryPosts = allPosts.filter(post => 
      categoryMappings[slug].includes(post.slug)
    );

    const postPreviews = categoryPosts.map((post) => (
      <PostPreview key={post.slug} {...post} />
    ));

    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-3">{categoryIcons[slug]}</span>
            <h1 className="text-2xl font-bold text-gray-800">{categoryNames[slug]}</h1>
          </div>
          <p className="text-gray-600">
            {categoryPosts.length} post{categoryPosts.length !== 1 ? 's' : ''} in this category
          </p>
        </div>
        
        {categoryPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {postPreviews}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts in this category yet.</p>
            <p className="text-gray-400 mt-2">Check back soon for new content!</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Category</h1>
          <p className="text-gray-600">There was an error loading the category page.</p>
        </div>
      </div>
    );
  }
};

export default CategoryPage; 