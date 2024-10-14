import Link from "next/link";
import { PostMetadata } from "./PostMetadata";

const PostPreview = (props: PostMetadata) => {
    return     <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
    <Link href={`/posts/${props.slug}`} className="block h-full">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-myblue line-clamp-2">{props.title}</h2>
        <p className="text-sm text-gray-600 mb-2">{props.date}</p>
        <p className="text-gray-700 line-clamp-3">{props.subtitle}</p>
      </div>
    </Link>
  </div>
}

export default PostPreview;