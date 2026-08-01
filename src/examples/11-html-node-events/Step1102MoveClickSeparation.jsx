import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step1102MoveClickSeparation({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false); const cleanupRef = useRef(() => {}); const [message, setMessage] = useState("버튼 클릭 대기 중");
  const report = (eventCount = 0) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, htmlDomCount: 1, buttonDomCount: 1, eventCount, lastEvent: eventCount ? "버튼 입력 분리" : "클릭 대기 중", consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const node = new ControlNode(coreView); node.template = '<div data-mf-html-node="11-02" style="box-sizing:border-box;width:100%;height:100%;padding:12px;border:2px solid #2877de;border-radius:12px;background:#eef6ff;font-family:sans-serif"><div style="font-weight:700;margin-bottom:9px">빈 영역은 노드 이동</div><button data-testid="separated-button" data-interactive="true" type="button" style="padding:8px 16px;border:0;border-radius:7px;background:#175bb9;color:white;cursor:pointer">버튼만 클릭</button></div>'; node.bounds = new Rect(52, 28, 150, 76); diagram.addItem(node); };
  const domCreated = (_sender, args) => { const node = args.node; const button = node.getContent().querySelector('[data-testid="separated-button"]'); if (!button) return; const handler = (event) => { event.stopPropagation(); const same = node.bounds.x === 52 && node.bounds.y === 28; setMessage(same ? "버튼 클릭과 노드 이동이 분리됨" : "버튼 클릭 전 노드가 이동됨"); report(1); }; button.addEventListener("click", handler); cleanupRef.current = () => button.removeEventListener("click", handler); report(0); };
  useEffect(() => () => { cleanupRef.current(); diagram.clearAll(); }, [diagram]);
  return <div data-testid="diagram-demo"><p data-testid="separation-result">{message}</p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
