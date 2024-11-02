import { readFileSync } from "fs"
import { join } from "path"

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

//

export const getMarkdownFile = (path: string) => {
  // console.log("path :", path)
  const { fileMarkdownContent } = getReadFileContent(path)
  const { pageMetadata, pageHtmlContent } = extractMetadataAndHtml(fileMarkdownContent)
  const { htmlSectionsMap } = parseMarkdown(pageHtmlContent)

  return { pageMetadata, htmlSectionsMap }
}

type ReadFileContent = {
  fileMarkdownContent: string
}

export const getReadFileContent = (filePath: string): ReadFileContent => {
  // console.log("filePath :", filePath)
  if (!filePath) {
    throw new Error(`File not found: ${filePath}`)
  }

  const fileMarkdownContent = readFileSync(filePath, "utf-8")

  return { fileMarkdownContent }
}
