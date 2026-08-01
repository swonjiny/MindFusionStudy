import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step1101ButtonClick({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false); const listeners = useRef(new Map()); const [clicks, setClicks] = useState(0);
  const report = (eventCount = 0) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, htmlDomCount: 1, buttonDomCount: 1, eventCount, lastEvent: eventCount ? "HTML 버튼 클릭" : "클릭 대기 중", consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const node = new ControlNode(coreView); node.template = '<div data-mf-html-node="11-01" style="box-sizing:border-box;width:100%;height:100%;display:grid;place-items:center;border:1px solid #9abce9;border-radius:12px;background:white"><button data-testid="control-click-button" data-interactive="true" type="button" style="padding:10px 20px;border:0;border-radius:8px;background:#2468d6;color:white;cursor:pointer">클릭하세요</button></div>'; node.bounds = new Rect(58, 32, 140, 65); diagram.addItem(node); };
  const domCreated = (_sender, args) => { const button = args.node.getContent().querySelector('[data-testid="control-click-button"]'); if (!button || listeners.current.has(button)) return; const handler = () => setClicks((value) => { const next = value + 1; report(next); return next; }); button.addEventListener("click", handler); listeners.current.set(button, handler); report(0); };
  useEffect(() => () => { listeners.current.forEach((handler, element) => element.removeEventListener("click", handler)); listeners.current.clear(); diagram.clearAll(); }, [diagram]);
  return <div data-testid="diagram-demo"><p data-testid="button-click-count">버튼 클릭 {clicks}회</p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
