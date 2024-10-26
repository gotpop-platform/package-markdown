import { constructFilePath, readFileContent } from "./handleFile"

import { extractMetadataAndHtml } from "./extractMetadataAndHtml"
import { parseMarkdown } from "./parseMarkdown"

export const parseMarkdownFile = (directoryPath: string, fileName: string) => {
  const filePath = constructFilePath(directoryPath, fileName)

  const markdownContent = readFileContent(filePath)
  const { metadata, htmlContent } = extractMetadataAndHtml(markdownContent)
  const { htmlSectionsMap } = parseMarkdown(htmlContent ?? "")

  return { metadata, htmlSectionsMap }
}
