import type { MarkdownFileProps, MetaData } from "./markdown.types"

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

export const parseMarkdownFiles = async (dir: string): Promise<MarkdownFileProps[]> => {
  const foundFiles: string[] = await findMarkdownFiles(dir)

  const mapFiles = foundFiles.map(async (filePath): Promise<MarkdownFileProps> => {
    const path = filePath.replace(/\.md$/, "")
    const { metadata, htmlArray } = parseMarkdownFile(dir, path)

    const typedMetadata: MetaData = {
      title: metadata.title,
      slug: metadata.slug,
      author: metadata.author,
      description: metadata.description,
      date: metadata.date,
      prev: metadata.prev,
      next: metadata.next,
      id: metadata.id,
    }

    return { metadata: typedMetadata, htmlArray }
  })

  const parsedFiles: MarkdownFileProps[] = await Promise.all(mapFiles)

  return parsedFiles
}
