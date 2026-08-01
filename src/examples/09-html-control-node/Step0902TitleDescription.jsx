import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0902TitleDescription({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram());
  const viewRef = useRef(null);
  const initialized = useRef(false);
  const report = (htmlDomCount = 0) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, htmlDomCount, buttonDomCount: 0, consoleErrorCount: 0 });
  const initialize = () => {
    if (initialized.current) return;
    const coreView = viewRef.current?.find(); if (!coreView) return;
    initialized.current = true;
    const node = new ControlNode(coreView);
    node.template = `<article data-mf-html-node="09-02" style="box-sizing:border-box;width:100%;height:100%;padding:16px;border:1px solid #9abce9;border-radius:12px;background:white;font-family:sans-serif;box-shadow:0 6px 18px #1a4c8d20"><h3 style="margin:0 0 8px;color:#174c8c;font-size:17px">ControlNode 제목</h3><p style="margin:0;color:#52627a;font-size:13px;line-height:1.5">설명도 실제 HTML 문단으로 표시됩니다.</p></article>`;
    node.bounds = new Rect(55, 30, 145, 72); diagram.addItem(node);
  };
  const domCreated = (_sender, args) => report(args.node.getContent().querySelectorAll('[data-mf-html-node="09-02"]').length);
  useEffect(() => () => diagram.clearAll(), [diagram]);
  return <div data-testid="diagram-demo"><p>제목과 설명을 시맨틱 HTML로 구성합니다.</p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
