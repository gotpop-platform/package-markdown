export const extractMetadataAndHtml = (fileMarkdownContent: string) => {
  const metadataMatch = fileMarkdownContent.match(/^---\n([\s\S]*?)\n---/)

  let pageMetadata: Record<string, string> = {}
  let pageHtmlContent = fileMarkdownContent

  if (metadataMatch) {
    const metadataLines = metadataMatch[1].split("\n")

    metadataLines.forEach((line) => {
      const [key, value] = line.split(":").map((part) => part.trim())
      if (key && value) {
        pageMetadata[key] = value.replace(/^"|"$/g, "")
      }
    })

    pageHtmlContent = fileMarkdownContent.slice(metadataMatch[0].length)
  }

  return {
    pageMetadata,
    pageHtmlContent,
  }
}
