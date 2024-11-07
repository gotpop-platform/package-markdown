import { getMarkdownFile, parseMarkdownFile } from "./parseMarkdownFile"
import { join, parse } from "path"

import { Glob } from "bun"

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

const setNestedMap = (map: Map<string, any>, keys: string[], value: any) => {
  const key = keys.shift()
  if (!key) return

  if (!map.has(key)) {
    map.set(key, new Map<string, any>())
  }

  if (keys.length === 0) {
    map.set(key, value)
  } else {
    setNestedMap(map.get(key), keys, value)
  }
}

export const contentMap = async () => {
  const glob = new Glob("**/*.md")
  const contentDir = join(process.cwd(), "src/content")

  const contentMap = new Map<string, any>()

  for await (const file of glob.scan(contentDir)) {
    const relativePath = file.replace(contentDir + "/", "")
    const pathParts = relativePath.split("/")
    const fileName = pathParts.pop()
    const fileKey = fileName ? parse(fileName).name : ""

    const content = getMarkdownFile(join(contentDir, file))

    setNestedMap(contentMap, pathParts.concat(fileKey), content)
  }

  return contentMap
}
