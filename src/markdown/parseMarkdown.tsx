import { ComponentBlocksType, Toc } from "./markdown.types"

function parseMarkdownWithMetadata(content: string) {
  // Split the content by the metadata delimiters
  const parts = content.split(/<!--\s*(.*?)\s*-->/).filter((part) => part.trim() !== "")

  // Initialize a Map to store the grouped content
  const contentMap = new Map<string, string>()

  // Iterate through the parts and populate the Map
  for (let i = 0; i < parts.length; i += 2) {
    const key = parts[i].trim()
    const value = parts[i + 1] ? parts[i + 1].trim() : ""
    contentMap.set(key, value)
  }

  return contentMap
}

export const parseMarkdown = (markdown: string) => {
  // Extract sections
  const parsedContent = parseMarkdownWithMetadata(markdown)

  const parsedSectionsMap = new Map<
    string,
    {
      metadata: { [key: string]: string }
      html: string
      toc: Toc[]
      componentBlocks: ComponentBlocksType
    }
  >()

  parsedContent.forEach((content, metadata) => {
    let html = content

    // Convert headers with unique IDs
    let h1Counter = 0
    let h2Counter = 0
    let h3Counter = 0
    const toc: Toc[] = []

    // H1
    html = html.replace(/^# (.*$)/gim, (match, p1) => {
      h1Counter++
      const id = `h1-${metadata}-${h1Counter}`
      toc.push({ level: 1, id, text: p1 })
      return `<a href='#${id}'><h1 id="${id}">${p1}</h1></a>`
    })

    // H2
    html = html.replace(/^## (.*$)/gim, (match, p1) => {
      h2Counter++
      const id = `h2-${metadata}-${h2Counter}`
      toc.push({ level: 2, id, text: p1 })
      return `<a href='#${id}'><h2 id="${id}">${p1}</h2></a>`
    })

    // H3
    html = html.replace(/^### (.*$)/gim, (match, p1) => {
      h3Counter++
      const id = `h3-${metadata}-${h3Counter}`
      toc.push({ level: 3, id, text: p1 })
      return `<a href='#${id}'><h3 id="${id}">${p1}</h3></a>`
    })

    // Bold
    html = html.replace(/(\*\*|__)(.*?)\1/g, "<b>$2</b>")

    // Italics
    html = html.replace(/(\*|_)(.*?)\1/g, "<i>$2</i>")

    // Convert links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

    // Extract code blocks with language
    const codeBlocks: { key: string; code: string; language: string }[] = []
    html = html.replace(/```(\w+)?\n([^`]+)```/g, (match, lang, code) => {
      const key = `__CODE_BLOCK_${codeBlocks.length}__`
      codeBlocks.push({ key, code, language: lang || "plaintext" })

      return key
    })

    // Extract shortcodes
    const shortcodes: {
      key: string
      component: string
      props: Record<string, string>
      children: string
    }[] = []
    html = html.replace(/\[<(\w+)(.*?)>(.*?)<\/\1>\]/g, (match, component, propsStr, children) => {
      const key = `__SHORTCODE_${shortcodes.length}__`
      const props: Record<string, string> = {}

      // Parse props
      propsStr
        .trim()
        .split(/\s+/)
        .forEach((prop) => {
          const [key, value] = prop.split("=")
          props[key] = value.replace(/['"]/g, "")
        })

      shortcodes.push({ key, component, props, children })

      return key
    })

    // Convert plain text to paragraphs
    html = html.replace(/(^|\n)([^<>\n]+)(?=\n|$)/g, (_, start, text) => {
      const trimmedText = text.trim()
      if (trimmedText) {
        return `${start}<p>${trimmedText}</p>`
      }
      return start
    })

    const componentBlocks = new Map<
      string,
      {
        code: string
        language: string
      }
    >()

    codeBlocks.map((item, index) => {
      const { key, code, language } = codeBlocks[parseInt(index.toString(), 10)]
      componentBlocks.set(key, { code, language })
    })

    shortcodes.forEach(({ key, component, props, children }) => {
      componentBlocks.set(key, { component, props, children })
    })

    parsedSectionsMap.set(metadata, {
      metadata: { section: metadata },
      html,
      toc,
      componentBlocks: componentBlocks.size > 0 ? componentBlocks : null,
    })
  })

  return parsedSectionsMap
}
