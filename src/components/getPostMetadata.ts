import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { PostMetadata } from "@/components/PostMetadata";

const getPostMetadata = (): PostMetadata[] => {
    try {
        const folder = path.join(process.cwd(), "posts");
        const files = fs.readdirSync(folder);
        const markdownPosts = files.filter((file) => file.endsWith("md"));
        
        const posts: PostMetadata[] = [];
        
        // Process markdown files
        for (const fileName of markdownPosts) {
            try {
                const fileContents = fs.readFileSync(path.join(folder, fileName), "utf8");
                const { data, content } = matter(fileContents);
                
                posts.push({
                    title: data.title,
                    date: data.date,
                    subtitle: data.subtitle,
                    slug: fileName.replace(".md", "").replace(/\s+/g, "-").toLowerCase()
                });
            } catch (error) {
                console.error(`Error reading file ${fileName}:`, error);
            }
        }

        // Sort posts by date (newest first)
        return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error("Error reading posts directory:", error);
        return [];
    }
}

export default getPostMetadata;