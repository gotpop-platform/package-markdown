import { ComponentBlock, TableOfContentsType } from "./parseMarkdown.types"

function splitIntoSections(markdown: string) {
  const sections = markdown.split(/<!--\s*(.*?)\s*-->/).filter((section) => section.trim() !== "")

  const markdownSectionsMap = new Map<string, string>()

  for (let i = 0; i < sections.length; i += 2) {
    const key = sections[i].trim()
    const value = sections[i + 1] ? sections[i + 1].trim() : ""

    markdownSectionsMap.set(key, value)
  }

  return { markdownSectionsMap }
}

export const parseMarkdown = (markdown: string) => {
  const { markdownSectionsMap } = splitIntoSections(markdown)
  const htmlSectionsMap = new Map()

  for (const sectionKey of markdownSectionsMap.keys()) {
    const sectionMarkdown = markdownSectionsMap.get(sectionKey)

    let sectionHtml = sectionMarkdown

    // Convert headers with unique IDs
    let h1Counter = 0
    let h2Counter = 0
    let h3Counter = 0
    const sectionTableOfContents: TableOfContentsType[] = []

    const headerLevels = [
      { regex: /^# (.*$)/gim, tag: "h1", counter: () => h1Counter++, level: 1 },
      { regex: /^## (.*$)/gim, tag: "h2", counter: () => h2Counter++, level: 2 },
      { regex: /^### (.*$)/gim, tag: "h3", counter: () => h3Counter++, level: 3 },
    ]

    headerLevels.forEach(({ regex, tag, counter, level }) => {
      sectionHtml = sectionHtml?.replace(regex, (match, p1) => {
        const count = counter()
        const id = `${tag}-${sectionKey}-${count}`
        sectionTableOfContents.push({ level, id, text: p1 })
        return `<a href='#${id}'><${tag} id="${id}">${p1}</${tag}></a>`
      })
    })

    // Bold
    sectionHtml = sectionHtml?.replace(/(\*\*|__)(.*?)\1/g, "<b>$2</b>")

    // Italics
    sectionHtml = sectionHtml?.replace(/(\*|_)(.*?)\1/g, "<i>$2</i>")

    // Convert links
    sectionHtml = sectionHtml?.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

    // Extract code blocks with language
    const codeBlocks: { key: string; code: string; language: string }[] = []

    sectionHtml = sectionHtml?.replace(/```(\w+)?\n([^`]+)```/g, (match, lang, code) => {
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
    sectionHtml = sectionHtml?.replace(
      /\[<(\w+)(.*?)>(.*?)<\/\1>\]/g,
      (match, component, propsStr, children) => {
        const key = `__SHORTCODE_${shortcodes.length}__`
        const props: Record<string, string> = {}

        // Parse props if propsStr is defined
        if (propsStr) {
          propsStr
            .trim()
            .split(/\s+/)
            .forEach((prop: { split: (arg0: string) => [any, any] }) => {
              const [key, value] = prop.split("=")
              props[key] = value ? value.replace(/['"]/g, "") : ""
            })
        }

        shortcodes.push({ key, component, props, children })

        return key
      }
    )

    // Convert plain text to paragraphs
    sectionHtml = sectionHtml?.replace(/(^|\n)([^<>\n]+)(?=\n|$)/g, (_, start, text) => {
      const trimmedText = text.trim()
      if (trimmedText) {
        return `${start}<p>${trimmedText}</p>`
      }
      return start
    })

    const componentBlocksMap = new Map<string, ComponentBlock>()

    codeBlocks.map((__, i) => {
      const { key, code, language } = codeBlocks[i]

      componentBlocksMap.set(key, {
        component: "CodeBlock",
        props: {
          language,
          code,
        },
        children: code,
      })
    })

    shortcodes.map(({ key, component, props, children }) =>
      componentBlocksMap.set(key, { component, props, children })
    )

    const processedSectionHtmlAndData = {
      sectionMetadata: { section: sectionKey },
      sectionHtml,
      sectionTableOfContents,
      sectionComponents: componentBlocksMap.size > 0 ? componentBlocksMap : null,
    }

    htmlSectionsMap.set(sectionKey, processedSectionHtmlAndData)
  }

  return { htmlSectionsMap }
}
