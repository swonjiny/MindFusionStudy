import { useMemo, useState } from "react";
import { Button, Tabs, Tag, Typography, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const exampleSources = import.meta.glob("/src/examples/**/*.jsx", {
  query: "?raw",
  import: "default",
  eager: true,
});
const sharedSources = import.meta.glob(
  ["/src/examples/lessonDefinitions.js", "/src/styles/diagram.css", "/src/data/lessonMenus.js"],
  { query: "?raw", import: "default", eager: true },
);
const guideSources = import.meta.glob("/src/guides/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});
const verificationSources = import.meta.glob("/src/components/VerificationPanel.jsx", {
  query: "?raw",
  import: "default",
  eager: true,
});

const sourceFileByLesson = {
  "01-01": "/src/examples/01-diagram-basic/Step0101EmptyDiagram.jsx",
  "01-02": "/src/examples/01-diagram-basic/Step0102DiagramSize.jsx",
  "01-03": "/src/examples/01-diagram-basic/Step0103DiagramBackground.jsx",
  "02-01": "/src/examples/02-general-node/Step0201SingleNode.jsx",
  "02-02": "/src/examples/02-general-node/Step0202TwoNodes.jsx",
  "02-03": "/src/examples/02-general-node/Step0203FactoryNode.jsx",
  "02-04": "/src/examples/02-general-node/Step0204DirectNode.jsx",
  "02-05": "/src/examples/02-general-node/Step0205CreationComparison.jsx",
  "02-06": "/src/examples/02-general-node/Step0206NodePosition.jsx",
  "02-07": "/src/examples/02-general-node/Step0207NodeSize.jsx",
  "02-08": "/src/examples/02-general-node/Step0208NodeText.jsx",
  "02-09": "/src/examples/02-general-node/Step0209MultilineText.jsx",
  "02-10": "/src/examples/02-general-node/Step0210TextAlignment.jsx",
  "02-11": "/src/examples/02-general-node/Step0211NodeBackground.jsx",
  "02-12": "/src/examples/02-general-node/Step0212NodeBorder.jsx",
  "03-01": "/src/examples/03-node-content/Step0301TextPadding.jsx",
  "03-02": "/src/examples/03-node-content/Step0302FontStyle.jsx",
  "03-03": "/src/examples/03-node-content/Step0303TextStroke.jsx",
  "03-04": "/src/examples/03-node-content/Step0304ClipText.jsx",
  "03-05": "/src/examples/03-node-content/Step0305ResizeToFitText.jsx",
  "04-01": "/src/examples/04-selection-events/Step0401NodeClick.jsx",
  "04-02": "/src/examples/04-selection-events/Step0402SingleSelection.jsx",
  "04-03": "/src/examples/04-selection-events/Step0403MultipleSelection.jsx",
  "04-04": "/src/examples/04-selection-events/Step0404SelectionChanged.jsx",
  "04-05": "/src/examples/04-selection-events/Step0405NodeDoubleClick.jsx",
  "05-01": "/src/examples/05-links/Step0501SingleLink.jsx",
  "05-02": "/src/examples/05-links/Step0502TwoLinks.jsx",
  "05-03": "/src/examples/05-links/Step0503LinkText.jsx",
  "05-04": "/src/examples/05-links/Step0504ArrowHead.jsx",
  "05-05": "/src/examples/05-links/Step0505LinkStyles.jsx",
};

export default function SourceCodeViewer({ lesson }) {
  const [activeKey, setActiveKey] = useState("jsx");

  const files = useMemo(() => {
    const jsxPath = sourceFileByLesson[lesson.key];
    return {
      jsx: { path: jsxPath, code: exampleSources[jsxPath] || "" },
      css: { path: "/src/styles/diagram.css", code: sharedSources["/src/styles/diagram.css"] || "" },
      data: { path: "/src/examples/lessonDefinitions.js", code: sharedSources["/src/examples/lessonDefinitions.js"] || "" },
      guide: { path: lesson.guidePath, code: guideSources[lesson.guidePath] || "" },
      verify: {
        path: "/src/components/VerificationPanel.jsx",
        code: verificationSources["/src/components/VerificationPanel.jsx"] || "",
      },
    };
  }, [lesson]);

  const copy = async () => {
    await navigator.clipboard.writeText(files[activeKey].code);
    message.success("현재 파일 코드를 복사했습니다.");
  };

  const items = [
    ["jsx", "예제 JSX"],
    ["css", "CSS"],
    ["data", "데이터 파일"],
    ["verify", "검증 코드"],
    ["guide", "Markdown"],
  ].map(([key, label]) => ({
    key,
    label,
    children: (
      <div className="source-panel">
        <div className="source-meta">
          <Typography.Text code>{files[key].path}</Typography.Text>
          <Tag>{files[key].code.split("\n").length} lines</Tag>
        </div>
        <pre><code>{files[key].code}</code></pre>
      </div>
    ),
  }));

  return (
    <section data-testid="source-code-viewer">
      <div className="section-toolbar">
        <Typography.Title level={4}>실제 소스 코드</Typography.Title>
        <Button icon={<CopyOutlined />} onClick={copy}>코드 복사</Button>
      </div>
      <Tabs activeKey={activeKey} onChange={setActiveKey} items={items} />
    </section>
  );
}
