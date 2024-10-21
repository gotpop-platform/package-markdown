import { constructFilePath, readFileContent } from "./handleFile"

import { extractMetadata } from "./extractMetadata"
import { parseMarkdown } from "./parseMarkdown"

export const parseMarkdownFile = (directoryPath: string, fileName: string) => {
  const filePath = constructFilePath(directoryPath, fileName)

  const markdownContent = readFileContent(filePath)
  const { metadata, htmlContent } = extractMetadata(markdownContent)
  const htmlArray = parseMarkdown(htmlContent ?? "")

  return { metadata, htmlArray }
}
