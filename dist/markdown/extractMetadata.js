export const extractMetadata = (markdownContent) => {
    const metadataMatch = markdownContent.match(/^----\n([\s\S]*?)\n----/);
    let metadata = {};
    let htmlContent = markdownContent;
    if (metadataMatch) {
        const metadataLines = metadataMatch[1].split("\n");
        metadataLines.forEach((line) => {
            const [key, value] = line.split(":").map((part) => part.trim());
            if (key && value) {
                metadata[key] = value.replace(/^"|"$/g, "");
            }
        });
        htmlContent = markdownContent.slice(metadataMatch[0].length);
    }
    return {
        metadata: {
            slug: metadata.slug || "",
            title: metadata.title || "",
            description: metadata.description || "",
            section: metadata.section || "",
            ...metadata,
        },
        htmlContent,
    };
};
