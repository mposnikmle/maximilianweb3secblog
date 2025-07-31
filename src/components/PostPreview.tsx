import Link from "next/link";
import { PostMetadata } from "./PostMetadata";

const PostPreview = (props: PostMetadata) => {
  return (
    <div className="itunes-card overflow-hidden">
      <Link href={`/posts/${props.slug}`} className="block h-full">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
            {props.title}
          </h2>
          <p className="text-sm text-gray-500 mb-2">{props.date}</p>
          <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">{props.subtitle}</p>
          <div className="mt-3 flex items-center">
            <span className="text-xs text-gray-400">📄 Article</span>
            <span className="ml-auto text-xs text-gray-400">▶</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostPreview;
