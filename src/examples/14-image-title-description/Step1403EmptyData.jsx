import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

const cards = [];

export default function Step1403EmptyData({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false);
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 1, linkCount: 0, htmlDomCount: 1, buttonDomCount: 0, cardCount: cards.length, cardDomCount: 0, selectedNodeCount: 0, cardExpanded: true, selectedCardCount: 0, emptyDataVisible: true, consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const content = cards.length ? cards.map((card) => `<article data-card-id="${card.id}">${card.nickname}</article>`).join("") : '<div data-testid="empty-card-state" style="display:grid;place-items:center;height:100%;color:#61708a;font:600 14px sans-serif">카드 데이터가 없습니다.</div>'; const node = new ControlNode(coreView); node.template = `<section data-mf-card-node="14-03" style="box-sizing:border-box;width:100%;height:100%;padding:14px;border:2px dashed #9ab0cc;border-radius:14px;background:#f8fafc">${content}</section>`; node.bounds = new Rect(62, 35, 120, 44); diagram.addItem(node); };
  const domCreated = () => report();
  useEffect(() => () => diagram.clearAll(), [diagram]);
  return <div data-testid="diagram-demo"><p>빈 배열이면 명시적인 빈 상태를 표시합니다.</p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
