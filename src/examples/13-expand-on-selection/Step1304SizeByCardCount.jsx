import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

const cards = [{ id: 1, nickname: "민트", intro: "UI 설계" }, { id: 2, nickname: "라온", intro: "시각화" }, { id: 3, nickname: "하루", intro: "UX 연구" }, { id: 4, nickname: "소담", intro: "콘텐츠" }, { id: 5, nickname: "노을", intro: "접근성" }];
const sizeFor = (count) => ({ width: 96 + Math.min(count, 3) * 10, height: 18 + count * 18 });
const expandedHtml = () => `<section data-mf-card-node="13-04" data-expanded="true" style="box-sizing:border-box;width:100%;height:100%;display:grid;gap:5px;padding:8px;border:3px solid #2468d6;border-radius:14px;background:#edf5ff">${cards.map((card) => `<article data-card-id="${card.id}" style="padding:6px 9px;border-radius:8px;background:white;font-family:sans-serif"><strong style="color:#17345f">${card.nickname}</strong><span style="margin-left:10px;color:#61708a;font-size:12px">${card.intro}</span></article>`).join("")}</section>`;

export default function Step1304SizeByCardCount({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false); const nodeRef = useRef(null); const [expanded, setExpanded] = useState(false); const events = useRef(0); const size = sizeFor(cards.length);
  const report = (isExpanded) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 1, linkCount: 0, htmlDomCount: 1, buttonDomCount: 0, cardCount: cards.length, cardDomCount: isExpanded ? cards.length : 0, selectedNodeCount: isExpanded ? 1 : 0, cardExpanded: isExpanded, selectedCardCount: 0, eventCount: events.current, lastEvent: isExpanded ? `계산 크기 ${size.width} × ${size.height}` : "선택 대기", consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const node = new ControlNode(coreView); node.template = '<section data-mf-card-node="13-04" data-expanded="false" style="box-sizing:border-box;width:100%;height:100%;display:grid;place-items:center;border:2px solid #8ba9d0;border-radius:14px;background:#f7fbff;font:700 15px sans-serif;color:#17345f">5명 · 선택하여 자동 크기 계산</section>'; node.bounds = new Rect(65, 40, 110, 34); nodeRef.current = node; diagram.addItem(node); };
  const domCreated = () => report(false);
  const selectionChanged = () => { const node = nodeRef.current; const content = node?.getContent?.(); if (!content) return; const selected = diagram.selection.nodes.includes(node); if (selected) { events.current += 1; content.innerHTML = expandedHtml(); node.bounds = new Rect(48, 2, size.width, size.height); diagram.invalidate(); } setExpanded(selected); report(selected); };
  useEffect(() => () => diagram.clearAll(), [diagram]);
  return <div data-testid="diagram-demo"><p data-testid="size-result">{expanded ? `카드 ${cards.length}개 · 계산 크기 ${size.width} × ${size.height}` : "축약 크기 110 × 34"}</p><button type="button" onClick={() => diagram.selection.addItem(nodeRef.current)}>5개 카드로 펼치기</button><div style={{ height: 430 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} onSelectionChanged={selectionChanged} style={{ width: "100%", height: "100%" }} /></div></div>;
}
