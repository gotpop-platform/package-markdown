import { readFileSync } from "fs"
import { join } from "path"

export const constructFilePath = (directoryPath: string, fileName: string): string =>
  join(directoryPath, `${fileName}.md`)

type ReadFileContent = {
  fileMarkdownContent: string
}

export const readFileContent = (filePath: string): ReadFileContent => {
  if (!filePath) {
    throw new Error(`File not found: ${filePath}`)
  }

  const fileMarkdownContent = readFileSync(filePath, "utf-8")

  return { fileMarkdownContent }
}
