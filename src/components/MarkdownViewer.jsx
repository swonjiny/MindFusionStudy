import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const guideSources = import.meta.glob("/src/guides/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export default function MarkdownViewer({ lesson }) {
  const markdown = guideSources[lesson.guidePath] || "# 개발 가이드를 불러오지 못했습니다.";
  return (
    <article className="markdown-viewer" data-testid="markdown-guide">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}
