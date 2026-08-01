/**
 * [프로젝트 구조 안내] 메뉴별 Markdown 문서를 읽어 초보자용 안내와 함께 HTML로 렌더링합니다.
 * import.meta.glob은 빌드 시 guides 폴더의 문서를 문자열로 포함하고, ReactMarkdown이 이를 표시합니다.
 * 원본 Markdown은 유지되며 beginnerGuideContent의 공통 설명이 화면에서 앞부분에 결합됩니다.
 */
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
