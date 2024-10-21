import { mkClass, useCSS } from "@gotpop-platform/package-utilities";
import { jsxFactory } from "@gotpop-platform/package-jsx-factory";
export function CodeBlock({ language = "css", children }) {
    const styles = { "--code-language": language };
    const { css } = useCSS({ meta: import.meta, styles });
    const escapeHtml = (unsafe) => unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    const escapedCode = escapeHtml(children || "");
    return (jsxFactory("div", { "data-language": language, class: mkClass(import.meta.file) },
        jsxFactory("style", null, css),
        jsxFactory("pre", null,
            jsxFactory("code", null, escapedCode))));
}
