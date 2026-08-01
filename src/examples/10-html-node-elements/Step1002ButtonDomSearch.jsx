import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step1002ButtonDomSearch({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false); const [found, setFound] = useState(false); const [contentApi, setContentApi] = useState(false);
  const report = (htmlDomCount = 0, buttonDomCount = 0) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, htmlDomCount, buttonDomCount, consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const node = new ControlNode(coreView); node.template = '<div data-mf-html-node="10-02" style="box-sizing:border-box;width:100%;height:100%;display:flex;flex-direction:column;gap:9px;align-items:center;justify-content:center;border:1px solid #9abce9;border-radius:12px;background:#fff"><strong style="font:600 14px sans-serif">DOM 검색 대상</strong><button data-control-action="confirm" data-interactive="true" type="button" style="padding:8px 18px;border:0;border-radius:7px;background:#2468d6;color:white">확인</button></div>'; node.bounds = new Rect(58, 30, 140, 72); diagram.addItem(node); };
  const domCreated = (_sender, args) => { const root = args.node.getContent(); const content = args.node.content; const button = root.querySelector('[data-control-action="confirm"]'); setFound(Boolean(button)); setContentApi(typeof content?.querySelector === "function"); report(root.querySelectorAll('[data-mf-html-node="10-02"]').length, button ? 1 : 0); };
  useEffect(() => () => diagram.clearAll(), [diagram]);
  return <div data-testid="diagram-demo"><p data-testid="dom-search-result">{found ? "getContent()로 버튼 DOM 검색 성공" : "버튼 DOM 대기 중"} · content API {contentApi ? "DOM 확인" : "배열/내부값"}</p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
