import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0901HtmlText({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram());
  const viewRef = useRef(null);
  const initialized = useRef(false);

  const report = (htmlDomCount = 0) => onStatus?.({
    diagramReady: true, viewReady: true, rendered: true,
    nodeCount: diagram.nodes.length, linkCount: diagram.links.length,
    htmlDomCount, buttonDomCount: 0, consoleErrorCount: 0,
  });

  const initialize = () => {
    if (initialized.current) return;
    const coreView = viewRef.current?.find();
    if (!coreView) return;
    initialized.current = true;

    const node = new ControlNode(coreView);
    node.template = `
      <div data-mf-html-node="09-01" style="box-sizing:border-box;width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:12px;border:2px solid #2877de;border-radius:10px;background:#eef6ff;color:#17345f;font:600 16px sans-serif;">
        실제 HTML 텍스트
      </div>`;
    node.bounds = new Rect(66, 38, 120, 54);
    diagram.addItem(node);
  };

  const domCreated = (_sender, args) => {
    const root = args.node.getContent();
    report(root.querySelectorAll('[data-mf-html-node="09-01"]').length);
  };

  useEffect(() => () => diagram.clearAll(), [diagram]);

  return (
    <div data-testid="diagram-demo">
      <p data-testid="html-status">ControlNode 템플릿을 실제 HTML DOM으로 렌더링합니다.</p>
      <div style={{ height: 460 }}>
        <DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify}
          onControlLoaded={initialize} onNodeDomCreated={domCreated}
          style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
