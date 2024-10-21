// export const parseMarkdown = (
//   markdown: string
// ): {
//   html: string
//   toc: Toc[]
// } => {
//   // Convert headers with unique IDs
//   let h1Counter = 0
//   let h2Counter = 0
//   let h3Counter = 0
//   const toc: Toc[] = []

import { Toc } from "./markdown.types"

//   // H1
//   markdown = markdown.replace(/^# (.*$)/gim, (_, header) => {
//     const id = `h1-${h1Counter++}`
//     toc.push({ level: 1, id, text: header })
//     return `<a href='#${id}'><h1 id="${id}">${header}</h1></a>`
//   })

//   // H2
//   markdown = markdown.replace(/^## (.*$)/gim, (_, header) => {
//     const id = `h2-${h2Counter++}`
//     toc.push({ level: 2, id, text: header })
//     return `<a href='#${id}'><h2 id="${id}">${header}</h2></a>`
//   })

//   // H3
//   markdown = markdown.replace(/^### (.*$)/gim, (_, header) => {
//     const id = `h3-${h3Counter++}`
//     toc.push({ level: 3, id, text: header })
//     return `<a href='#${id}'><h3 id="${id}">${header}</h3></a>`
//   })

//   // Bold
//   markdown = markdown.replace(/(\*\*|__)(.*?)\1/g, "<b>$2</b>")

//   // Italics
//   markdown = markdown.replace(/(\*|_)(.*?)\1/g, "<i>$2</i>")

//   // Convert links
//   markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

//   // Extract code blocks with language
//   const codeBlocks: { code: string; language: string }[] = []
//   markdown = markdown.replace(/```(\w+)?\n([^`]+)```/g, (match, lang, code) => {
//     codeBlocks.push({ code, language: lang || "plaintext" })
//     return `__CODE_BLOCK_${codeBlocks.length - 1}__`
//   })

//   // Convert plain text to paragraphs
//   markdown = markdown.replace(/(^|\n)([^<>\n]+)(?=\n|$)/g, (_, start, text) => {
//     const trimmedText = text.trim()
//     if (trimmedText) {
//       return `${start}<p>${trimmedText}</p>`
//     }
//     return start
//   })

//   // Reinsert code blocks with language prop
//   const componentToVariable = (index: number) => {
//     const { code, language } = codeBlocks[index]
//     return <CodeBlock language={language}>{code}</CodeBlock>
//   }

//   markdown = markdown.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
//     return componentToVariable(index).toString()
//   })

//   return { html: markdown.trim(), toc }
// }

function parseMarkdownWithMetadata(content: string) {
  // Split the content by the metadata delimiters
  const parts = content.split("---\n").filter((part) => part.trim() !== "")

  // Initialize an empty array to store the grouped content
  const groupedContent = []

  // Iterate through the parts and group metadata with markdown content
  for (let i = 0; i < parts.length; i += 2) {
    const metadata = parts[i].trim()
    const markdownContent = parts[i + 1] ? parts[i + 1].trim() : ""

    // Convert metadata string into a key-value object
    const metadataObj = metadata.split("\n").reduce((acc, line) => {
      const [key, value] = line.split(":").map((str) => str.trim())
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    groupedContent.push({
      metadata: metadataObj,
      content: markdownContent,
    })
  }

  return groupedContent
}

export const parseMarkdown = (markdown: string) => {
  // Extract sections
  const parsedContent = parseMarkdownWithMetadata(markdown)

  // Parse each section
  const parsedSections = parsedContent.map(({ metadata, content }) => {
    let html = content

    // Convert headers with unique IDs
    let h1Counter = 0
    let h2Counter = 0
    let h3Counter = 0
    const toc: Toc[] = []

    // H1
    html = html.replace(/^# (.*$)/gim, (match, p1) => {
      h1Counter++
      const id = `h1-${h1Counter}`
      toc.push({ level: 1, id, text: p1 })
      return `<h1 id="${id}">${p1}</h1>`
    })

    // H2
    html = html.replace(/^## (.*$)/gim, (match, p1) => {
      h2Counter++
      const id = `h2-${h2Counter}`
      toc.push({ level: 2, id, text: p1 })
      return `<h2 id="${id}">${p1}</h2>`
    })

    // H3
    html = html.replace(/^### (.*$)/gim, (match, p1) => {
      h3Counter++
      const id = `h3-${h3Counter}`
      toc.push({ level: 3, id, text: p1 })
      return `<h3 id="${id}">${p1}</h3>`
    })

    // Bold
    html = html.replace(/(\*\*|__)(.*?)\1/g, "<b>$2</b>")

    // Italics
    html = html.replace(/(\*|_)(.*?)\1/g, "<i>$2</i>")

    // Convert links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

    // Extract code blocks with language
    const codeBlocks: { code: string; language: string }[] = []
    html = html.replace(/```(\w+)?\n([^`]+)```/g, (match, lang, code) => {
      codeBlocks.push({ code, language: lang || "plaintext" })
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`
    })

    // Convert plain text to paragraphs
    html = html.replace(/(^|\n)([^<>\n]+)(?=\n|$)/g, (_, start, text) => {
      const trimmedText = text.trim()
      if (trimmedText) {
        return `${start}<p>${trimmedText}</p>`
      }
      return start
    })

    // Reinsert code blocks with language prop
    html = html
      .replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
        const { code, language } = codeBlocks[parseInt(index, 10)]
        return `<pre><code class="${language}">${code}</code></pre>`
      })
      .trim()

    return { metadata, html, toc }
  })

  return parsedSections
}
