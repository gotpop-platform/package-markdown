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

export type MarkdownFileProps = {
  metadata: MetaData
  htmlContent?: string
  htmlArray?: Map<
    string,
    {
      metadata: Record<string, string>
      html: string
      toc: Toc[]
    }
  >
  toc?: Toc[]
}

export type StyleObjProps = {
  [key: string]: string | number
}
