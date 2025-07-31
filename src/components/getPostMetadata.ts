import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { PostMetadata } from "@/components/PostMetadata";

const getPostMetadata = (): PostMetadata[] => {
    try {
        const folder = path.join(process.cwd(), "posts");
        const files = fs.readdirSync(folder);
        const markdownPosts = files.filter((file) => file.endsWith("md"));
        const pdfPosts = files.filter((file) => file.endsWith("pdf"));
        
        const posts: PostMetadata[] = [];
        
        // Process markdown files
        for (const fileName of markdownPosts) {
            try {
                const fileContents = fs.readFileSync(path.join(folder, fileName), "utf8");
                const matterResult = matter(fileContents);
                posts.push({
                    title: matterResult.data.title,
                    date: matterResult.data.date,
                    subtitle: matterResult.data.subtitle,
                    slug: fileName.replace(".md", ""),
                    type: "markdown"
                });
            } catch (error) {
                console.error(`Error reading file ${fileName}:`, error);
            }
        }

        // Process PDF files
        for (const fileName of pdfPosts) {
            try {
                const title = "NumPy Basics"; // Fixed title
                const slug = "july-31-2025-numpy-basics"; // Fixed slug
                
                posts.push({
                    title: title,
                    date: "2025-07-31",
                    subtitle: "Intro to NumPy arrays",
                    slug: slug,
                    type: "pdf"
                });
            } catch (error) {
                console.error(`Error processing PDF file ${fileName}:`, error);
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