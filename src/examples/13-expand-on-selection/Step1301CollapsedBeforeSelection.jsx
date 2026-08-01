import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

const cards = [{ id: 1, nickname: "민트", intro: "UI 설계", color: "#2b8a78" }, { id: 2, nickname: "라온", intro: "데이터 시각화", color: "#6f5bd3" }, { id: 3, nickname: "하루", intro: "UX 연구", color: "#d06b45" }];

export default function Step1301CollapsedBeforeSelection({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false);
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 1, linkCount: 0, htmlDomCount: 1, buttonDomCount: 0, cardCount: cards.length, cardDomCount: 0, selectedNodeCount: 0, cardExpanded: false, selectedCardCount: 0, consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const node = new ControlNode(coreView); node.template = `<section data-mf-card-node="13-01" data-expanded="false" style="box-sizing:border-box;width:100%;height:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border:2px solid #8ba9d0;border-radius:14px;background:#f7fbff;font-family:sans-serif"><strong style="color:#17345f">팀 카드 ${cards.length}명</strong><span style="color:#6b7b92;font-size:12px">선택하여 펼치기</span></section>`; node.bounds = new Rect(65, 40, 110, 34); diagram.addItem(node); };
  const domCreated = () => report();
  useEffect(() => () => diagram.clearAll(), [diagram]);
  return <div data-testid="diagram-demo"><p data-testid="expand-state">선택 0개 · 축약 상태 · 카드 DOM 0개</p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
