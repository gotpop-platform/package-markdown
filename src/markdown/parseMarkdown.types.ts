export type StyleObjProps = Record<string, string | number>

export type TableOfContentsType = {
  level: number
  id: string
  text: string
}

export type ComponentBlock =
  | Record<string, string>
  | { component: string; props: Record<string, string>; children: string }

export type ComponentBlocksType = Map<string, ComponentBlock> | null

export type SectionType = {
  sectionMetadata: Record<string, string>
  sectionHtml: string
  sectionTableOfContents: TableOfContentsType[]
  sectionComponents: ComponentBlocksType
}

export type MarkdownFileProps = {
  pageMetadata: Record<string, string>
  htmlSectionsMap?: Map<string, SectionType>
}
