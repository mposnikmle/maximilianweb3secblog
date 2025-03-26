import Link from "next/link";
import { PostMetadata } from "./PostMetadata";

const PostPreview = (props: PostMetadata) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-transform hover:scale-105 border border-gray-700">
      <Link href={`/posts/${props.slug}`} className="block h-full">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2 text-blue-400 line-clamp-2">
            {props.title}
          </h2>
          <p className="text-sm text-gray-500 mb-2">{props.date}</p>
          <p className="text-gray-300 line-clamp-3">{props.subtitle}</p>
        </div>
      </Link>
    </div>
  );
};

export default PostPreview;
