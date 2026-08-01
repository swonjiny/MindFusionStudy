import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { buildBeginnerGuideMarkdown } from "../data/beginnerGuideContent";

const guideSources = import.meta.glob("/src/guides/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export default function MarkdownViewer({ lesson }) {
  const originalMarkdown = guideSources[lesson.guidePath] || "";
  const markdown = buildBeginnerGuideMarkdown(lesson, originalMarkdown);
  return (
    <article className="markdown-viewer" data-testid="markdown-guide">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}
