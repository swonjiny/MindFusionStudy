import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step1103PreventDuplicate({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false); const registered = useRef(new WeakSet()); const listeners = useRef(new Map()); const registrations = useRef(0); const [clicks, setClicks] = useState(0);
  const report = (eventCount = 0) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, htmlDomCount: 1, buttonDomCount: 1, eventCount, listenerCount: registrations.current, lastEvent: eventCount ? "중복 없는 버튼 클릭" : "클릭 대기 중", consoleErrorCount: 0 });
  const attachOnce = (root) => { const button = root.querySelector('[data-testid="dedup-button"]'); if (!button || registered.current.has(button)) return; registered.current.add(button); registrations.current += 1; const handler = () => setClicks((value) => { const next = value + 1; report(next); return next; }); button.addEventListener("click", handler); listeners.current.set(button, handler); };
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const node = new ControlNode(coreView); node.template = '<div data-mf-html-node="11-03" style="box-sizing:border-box;width:100%;height:100%;display:grid;place-items:center;border:1px solid #9abce9;border-radius:12px;background:white"><button data-testid="dedup-button" data-interactive="true" type="button" style="padding:10px 18px;border:0;border-radius:8px;background:#2468d6;color:white">한 번만 등록</button></div>'; node.bounds = new Rect(58, 32, 140, 65); diagram.addItem(node); };
  const domCreated = (_sender, args) => { const root = args.node.getContent(); attachOnce(root); attachOnce(root); report(0); };
  useEffect(() => () => { listeners.current.forEach((handler, element) => element.removeEventListener("click", handler)); listeners.current.clear(); diagram.clearAll(); }, [diagram]);
  return <div data-testid="diagram-demo"><p><span data-testid="listener-count">리스너 등록 {registrations.current}회</span> · <span data-testid="dedup-click-count">클릭 {clicks}회</span></p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
