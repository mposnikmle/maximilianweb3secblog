interface PostContentProps {
  post: {
    content: string;
    data: {
      title: string;
      date: string;
      subtitle: string;
      tags?: string;
    };
  };
}

const PostContent = ({ post }: PostContentProps) => {
  return (
    <div className="rounded-lg shadow-2xl overflow-hidden transition-colors duration-200 bg-white border border-gray-200 dark:bg-gray-800">
      <div className="p-6 border-b text-center border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {post.data.title}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {post.data.date}
        </p>
        <div className="flex gap-2 justify-center mt-3">
          {post.data.tags?.split(/[,\s]+/).filter(tag => tag.trim()).map((tag: string) => (
            <span key={tag} className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              {tag.trim()}
            </span>
          ))}
        </div>
      </div>
      
      <article className="p-6 prose max-w-none prose-invert">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
};

export default PostContent; 