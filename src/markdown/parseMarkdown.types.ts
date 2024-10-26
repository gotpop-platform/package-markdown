export type MetaData = {
  slug: string
  title: string
  author?: string
  date?: string
  description: string
  prev?: string
  next?: string
  id?: string
  section?: string
}

export type Toc = {
  level: number
  id: string
  text: string
}

export type ComponentBlocksType = Map<
  string,
  {
    [key: string]: string
  }
> | null

export type MarkdownFileProps = {
  metadata: MetaData
  htmlContent?: string
  htmlSectionsMap?: Map<
    string,
    {
      metadata: Record<string, string>
      html: string
      toc: Toc[]
      componentBlocks?: ComponentBlocksType
    }
  >
  toc?: Toc[]
}

export type StyleObjProps = {
  [key: string]: string | number
}

export type ComponentBlock =
  | { code: string; language: string }
  | { component: string; props: Record<string, string>; children: string }
