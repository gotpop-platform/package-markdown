export * from "./parseMarkdown.types"
export * from "./parseMarkdownFile"
export * from "./parseMarkdownFiles"

import { parseMarkdownFileLoader } from "./parseMarkdownFile"

import { plugin, type BunPlugin } from "bun"

const myPlugin = () => {
  const myPlugin: BunPlugin = {
    name: "markdownLoader",
    setup(build) {
      build.onLoad({ filter: /\.md$/ }, async (args) => {
        // Read file content
        const text = await Bun.file(args.path).text()

        // Parse markdown
        const parsedContent = await parseMarkdownFileLoader(args.path)

        // Return with proper exports object
        return {
          exports: {
            default: parsedContent,
            content: parsedContent,
          },
          loader: "object",
        }
      })
    },
  }

  plugin(myPlugin)
}

myPlugin()

export default myPlugin
