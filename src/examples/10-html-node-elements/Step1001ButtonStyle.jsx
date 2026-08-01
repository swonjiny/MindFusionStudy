import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step1001ButtonStyle({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false);
  const report = (htmlDomCount = 0, buttonDomCount = 0) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, htmlDomCount, buttonDomCount, consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const node = new ControlNode(coreView); node.template = '<section data-mf-html-node="10-01" style="box-sizing:border-box;width:100%;height:100%;display:grid;place-items:center;border:1px solid #a9c3e9;border-radius:12px;background:white"><button data-testid="styled-button" data-interactive="true" type="button" style="padding:10px 22px;border:0;border-radius:8px;background:#2468d6;color:white;font:600 14px sans-serif;cursor:pointer">실행 버튼</button></section>'; node.bounds = new Rect(58, 32, 140, 65); diagram.addItem(node); };
  const domCreated = (_sender, args) => { const root = args.node.getContent(); report(root.querySelectorAll('[data-mf-html-node="10-01"]').length, root.querySelectorAll('button').length); };
  useEffect(() => () => diagram.clearAll(), [diagram]);
  return <div data-testid="diagram-demo"><p>아직 이벤트를 연결하지 않고 HTML 버튼의 모양만 만듭니다.</p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
