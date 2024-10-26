import { Glob } from "bun"
import { join } from "path"
import { parseMarkdownFile } from "./parseMarkdownFile"

const findMarkdownFiles = async (file: string): Promise<string[]> => {
  const glob = new Glob("**/*.md")
  const markdownFiles: string[] = []

  const contentDir = join(process.cwd(), file)

  for await (const file of glob.scan(contentDir)) {
    markdownFiles.push(file)
  }

  return markdownFiles
}

export const parseMarkdownFiles = async (dir: string) => {
  const foundFiles: string[] = await findMarkdownFiles(dir)

  const mapFiles = foundFiles.map(async (filePath) => {
    const path = filePath.replace(/\.md$/, "")

    const { pageMetadata, htmlSectionsMap } = parseMarkdownFile(dir, path)

    return { pageMetadata, htmlSectionsMap }
  })

  const parsedFiles = await Promise.all(mapFiles)

  return parsedFiles
}
