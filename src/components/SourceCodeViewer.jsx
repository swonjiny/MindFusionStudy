import { useMemo, useState } from "react";
import { Alert, Button, Tabs, Tag, Typography, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const exampleSources = import.meta.glob("/src/examples/**/*.jsx", {
  query: "?raw",
  import: "default",
  eager: true,
});
const guideSources = import.meta.glob("/src/guides/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});
const integratedSources = import.meta.glob("/src/features/integrated/*.{js,jsx,css}", {
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
  "06-01": "/src/examples/06-parent-child-tree/Step0601ParentOneChild.jsx",
  "06-02": "/src/examples/06-parent-child-tree/Step0602ParentTwoChildren.jsx",
  "06-03": "/src/examples/06-parent-child-tree/Step0603ParentFiveChildren.jsx",
  "06-04": "/src/examples/06-parent-child-tree/Step0604Grandchildren.jsx",
  "06-05": "/src/examples/06-parent-child-tree/Step0605ThreeLevelTree.jsx",
  "07-01": "/src/examples/07-tree-layout/Step0701VerticalTreeLayout.jsx",
  "07-02": "/src/examples/07-tree-layout/Step0702LayoutSpacing.jsx",
  "07-03": "/src/examples/07-tree-layout/Step0703HorizontalTreeLayout.jsx",
  "07-04": "/src/examples/07-tree-layout/Step0704ThreeLevelAutoLayout.jsx",
  "07-05": "/src/examples/07-tree-layout/Step0705RelayoutAfterAdd.jsx",
  "08-01": "/src/examples/08-collapse-expand/Step0801CollapseChildren.jsx",
  "08-02": "/src/examples/08-collapse-expand/Step0802RecursiveCollapse.jsx",
  "08-03": "/src/examples/08-collapse-expand/Step0803RestoreState.jsx",
  "08-04": "/src/examples/08-collapse-expand/Step0804CollapseAll.jsx",
  "08-05": "/src/examples/08-collapse-expand/Step0805ExpandAll.jsx",
  "08-06": "/src/examples/08-collapse-expand/Step0806ExpandToDepth.jsx",
  "09-01": "/src/examples/09-html-control-node/Step0901HtmlText.jsx",
  "09-02": "/src/examples/09-html-control-node/Step0902TitleDescription.jsx",
  "09-03": "/src/examples/09-html-control-node/Step0903Image.jsx",
  "09-04": "/src/examples/09-html-control-node/Step0904Alternatives.jsx",
  "10-01": "/src/examples/10-html-node-elements/Step1001ButtonStyle.jsx",
  "10-02": "/src/examples/10-html-node-elements/Step1002ButtonDomSearch.jsx",
  "11-01": "/src/examples/11-html-node-events/Step1101ButtonClick.jsx",
  "11-02": "/src/examples/11-html-node-events/Step1102MoveClickSeparation.jsx",
  "11-03": "/src/examples/11-html-node-events/Step1103PreventDuplicate.jsx",
  "11-04": "/src/examples/11-html-node-events/Step1104CleanupOnUnmount.jsx",
  "12-01": "/src/examples/12-business-cards/Step1201OneCard.jsx",
  "12-02": "/src/examples/12-business-cards/Step1202TwoCards.jsx",
  "12-03": "/src/examples/12-business-cards/Step1203ThreeCards.jsx",
  "12-04": "/src/examples/12-business-cards/Step1204FiveCards.jsx",
  "13-01": "/src/examples/13-expand-on-selection/Step1301CollapsedBeforeSelection.jsx",
  "13-02": "/src/examples/13-expand-on-selection/Step1302ExpandSelected.jsx",
  "13-03": "/src/examples/13-expand-on-selection/Step1303RestoreOnDeselect.jsx",
  "13-04": "/src/examples/13-expand-on-selection/Step1304SizeByCardCount.jsx",
  "14-01": "/src/examples/14-image-title-description/Step1401ProfileContent.jsx",
  "14-02": "/src/examples/14-image-title-description/Step1402ImageFallback.jsx",
  "14-03": "/src/examples/14-image-title-description/Step1403EmptyData.jsx",
  "14-04": "/src/examples/14-image-title-description/Step1404CardClickSelection.jsx",
  "15-01": "/src/examples/15-composite-content-tree/Step1501RichRootNode.jsx",
  "15-02": "/src/examples/15-composite-content-tree/Step1502ChildrenGrandchildren.jsx",
  "15-03": "/src/examples/15-composite-content-tree/Step1503RecursiveTreeControls.jsx",
  "16-01": "/src/examples/16-external-tools/Step1601CenterSelectedNode.jsx",
  "16-02": "/src/examples/16-external-tools/Step1602ViewportControls.jsx",
  "16-03": "/src/examples/16-external-tools/Step1603DetailPanel.jsx",
  "17-01": "/src/examples/17-data-integration/Step1701JsonData.jsx",
  "17-02": "/src/examples/17-data-integration/Step1702MockApiLoading.jsx",
  "17-03": "/src/examples/17-data-integration/Step1703DataError.jsx",
  "17-04": "/src/examples/17-data-integration/Step1704EmptyData.jsx",
  "18-01": "/src/examples/18-runtime-verification/Step1801SearchNodes.jsx",
  "18-02": "/src/examples/18-runtime-verification/Step1802FilterNodes.jsx",
  "18-03": "/src/examples/18-runtime-verification/Step1803AutomaticVerification.jsx",
  "19-01": "/src/examples/19-final-example/Step1901IntegratedExplorer.jsx",
};

export default function SourceCodeViewer({ lesson }) {
  const [activeKey, setActiveKey] = useState("jsx");

  const files = useMemo(() => {
    const jsxPath = sourceFileByLesson[lesson.key];
    const componentName = jsxPath.split("/").at(-1).replace(".jsx", "");
    const usesIntegratedFeature = Number(lesson.category) >= 15;
    const graphPackage = lesson.category === "07" ? " @mindfusion/graphs" : "";
    const usage = `npm install react react-dom @mindfusion/diagramming @mindfusion/diagramming-react @mindfusion/drawing${graphPackage}

// main.jsx
import { createRoot } from "react-dom/client";
import ${componentName} from "./${componentName}";

// MindFusion React 4.9.0 래퍼는 개발 환경의 StrictMode 이중 마운트를 지원하지 않습니다.
createRoot(document.getElementById("root")).render(<${componentName} />);
`;
    const shared = Object.entries(integratedSources)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([path, code]) => `// ${path}\n${code}`)
      .join("\n\n");
    return {
      jsx: { path: jsxPath, code: exampleSources[jsxPath] || "" },
      usage: { path: "설치 및 App.jsx 사용 예시", code: usage },
      guide: { path: lesson.guidePath, code: guideSources[lesson.guidePath] || "" },
      ...(usesIntegratedFeature ? { shared: { path: "/src/features/integrated/*", code: shared } } : {}),
    };
  }, [lesson]);

  const copy = async () => {
    await navigator.clipboard.writeText(files[activeKey].code);
    message.success("현재 파일 코드를 복사했습니다.");
  };

  const items = [
    ["jsx", files.shared ? "단계 JSX" : "독립 실행 JSX"],
    ["usage", "설치·사용 방법"],
    ["guide", "Markdown"],
    ...(files.shared ? [["shared", "공통 훅·유틸"]] : []),
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
      <Alert
        type="success"
        showIcon
        title={files.shared ? "단계 컴포넌트가 검증된 공통 구현을 재사용합니다" : "이 파일 하나만 복사하면 됩니다"}
        description={files.shared ? "15~19는 최종 예제를 따로 다시 작성하지 않고 같은 훅·데이터·템플릿·스타일을 조합합니다. 공통 훅·유틸 탭에서 함께 필요한 파일을 확인할 수 있습니다." : "예제 JSX는 프로젝트 내부 공통 모듈이나 CSS를 참조하지 않습니다. 필요한 MindFusion 패키지를 설치하고 App.jsx에서 렌더링하면 바로 실행됩니다."}
      />
      <div className="section-toolbar">
        <Typography.Title level={4}>복사 가능한 독립 예제</Typography.Title>
        <Button icon={<CopyOutlined />} onClick={copy}>코드 복사</Button>
      </div>
      <Tabs activeKey={activeKey} onChange={setActiveKey} items={items} />
    </section>
  );
}
