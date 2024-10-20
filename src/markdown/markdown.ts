import { constructFilePath, readFileContent } from "./handleFile"

import type { Toc } from "./markdown.types"
import { extractMetadata } from "./metaData"
import { parseMarkdown } from "./parseMarkdown"

const parseMarkdownFile = (
  directoryPath: string,
  fileName: string
): {
  metadata: Record<string, string>
  content: string
  toc: Toc[]
} => {
  const filePath = constructFilePath(directoryPath, fileName)

  const markdownContent = readFileContent(filePath)

  const { metadata, content } = extractMetadata(markdownContent)
  // console.log("content :", content)
  const stuff = parseMarkdown(content)
  // console.log("html :", stuff)

  // console.log("metadata :", metadata)
  return { metadata, stuff }
}

export { parseMarkdown, parseMarkdownFile }
