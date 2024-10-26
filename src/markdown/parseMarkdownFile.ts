import { constructFilePath, readFileContent } from "./handleMarkdownFile"

import { extractMetadataAndHtml } from "./extractMetadataAndHtml"
import { parseMarkdown } from "./parseMarkdown"

export const parseMarkdownFile = (directoryPath: string, fileName: string) => {
  const filePath = constructFilePath(directoryPath, fileName)

  const { fileMarkdownContent } = readFileContent(filePath)
  const { pageMetadata, pageHtmlContent } = extractMetadataAndHtml(fileMarkdownContent)
  const { htmlSectionsMap } = parseMarkdown(pageHtmlContent)

  return { pageMetadata, htmlSectionsMap }
}
