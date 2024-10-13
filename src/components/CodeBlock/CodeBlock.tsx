import { mkClass, useCSS } from "@gotpop-platform/package-utilities"

import { jsxFactory } from "@gotpop-platform/package-jsx-factory"

export function CodeBlock({ language = 'css', children }: { language?: string, children?: string }): JSX.Element {
  const { css } = useCSS({ meta: import.meta })

  return (
    <div data-language={language} class={mkClass(import.meta.file)}>
      <style>{css}</style>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  )
}
