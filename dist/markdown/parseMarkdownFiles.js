import { Glob } from "bun";
import { join } from "path";
import { parseMarkdownFile } from "./parseMarkdownFile";
export const findMarkdownFiles = async (file) => {
    const glob = new Glob("**/*.md");
    const markdownFiles = [];
    const contentDir = join(process.cwd(), file);
    for await (const file of glob.scan(contentDir)) {
        markdownFiles.push(file);
    }
    return markdownFiles;
};
export const parseMarkdownFiles = async (dir) => {
    const foundFiles = await findMarkdownFiles(dir);
    const mapFiles = foundFiles.map(async (filePath) => {
        const path = filePath.replace(/\.md$/, "");
        const { metadata, htmlArray } = parseMarkdownFile(dir, path);
        const typedMetadata = {
            title: metadata.title,
            slug: metadata.slug,
            author: metadata.author,
            description: metadata.description,
            date: metadata.date,
            prev: metadata.prev,
            next: metadata.next,
            id: metadata.id,
        };
        return { metadata: typedMetadata, htmlArray };
    });
    const parsedFiles = await Promise.all(mapFiles);
    return parsedFiles;
};
