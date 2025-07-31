import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { PostMetadata } from "@/components/PostMetadata";

const getPostMetadata = (): PostMetadata[] => {
    try {
        const folder = path.join(process.cwd(), "posts");
        const files = fs.readdirSync(folder);
        const markdownPosts = files.filter((file) => file.endsWith("md"));
        
        // Getting gray-matter data from each file
        const posts = markdownPosts.map((fileName) => {
            try {
                const fileContents = fs.readFileSync(path.join(folder, fileName), "utf8");
                const matterResult = matter(fileContents);
                return {
                    title: matterResult.data.title,
                    date: matterResult.data.date,
                    subtitle: matterResult.data.subtitle,
                    slug: fileName.replace(".md", ""),
                }
            } catch (error) {
                console.error(`Error reading file ${fileName}:`, error);
                return null;
            }
        }).filter((post): post is PostMetadata => post !== null);

        return posts;
    } catch (error) {
        console.error("Error reading posts directory:", error);
        return [];
    }
}

export default getPostMetadata;