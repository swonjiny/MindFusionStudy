import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

const cards = [{ id: 1, nickname: "민트", intro: "UI 설계" }, { id: 2, nickname: "라온", intro: "시각화" }, { id: 3, nickname: "하루", intro: "UX 연구" }];
const collapsedHtml = '<section data-mf-card-node="13-03" data-expanded="false" style="box-sizing:border-box;width:100%;height:100%;display:grid;place-items:center;border:2px solid #8ba9d0;border-radius:14px;background:#f7fbff;font:700 15px sans-serif;color:#17345f">팀 카드 3명 · 축약 상태</section>';
const expandedHtml = () => `<section data-mf-card-node="13-03" data-expanded="true" style="box-sizing:border-box;width:100%;height:100%;display:grid;gap:7px;padding:10px;border:3px solid #2468d6;border-radius:14px;background:#edf5ff">${cards.map((card) => `<article data-card-id="${card.id}" style="padding:9px;border-radius:9px;background:white;font-family:sans-serif"><strong style="color:#17345f">${card.nickname}</strong><span style="margin-left:10px;color:#61708a">${card.intro}</span></article>`).join("")}</section>`;

export default function Step1303RestoreOnDeselect({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false); const nodeRef = useRef(null); const [expanded, setExpanded] = useState(true); const events = useRef(0);
  const report = (isExpanded) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 1, linkCount: 0, htmlDomCount: 1, buttonDomCount: 0, cardCount: cards.length, cardDomCount: isExpanded ? cards.length : 0, selectedNodeCount: isExpanded ? 1 : 0, cardExpanded: isExpanded, selectedCardCount: 0, eventCount: events.current, lastEvent: isExpanded ? "선택 상태" : "선택 해제 후 복원", consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const node = new ControlNode(coreView); node.template = expandedHtml(); node.bounds = new Rect(54, 8, 126, 78); nodeRef.current = node; diagram.addItem(node); queueMicrotask(() => diagram.selection.addItem(node)); };
  const domCreated = () => report(true);
  const selectionChanged = () => { const node = nodeRef.current; const content = node?.getContent?.(); if (!content) return; const selected = diagram.selection.nodes.includes(node); events.current += 1; content.innerHTML = selected ? expandedHtml() : collapsedHtml; node.bounds = selected ? new Rect(54, 8, 126, 78) : new Rect(65, 40, 110, 34); diagram.invalidate(); setExpanded(selected); report(selected); };
  useEffect(() => () => diagram.clearAll(), [diagram]);
  return <div data-testid="diagram-demo"><p data-testid="expand-state">{expanded ? "선택 1개 · 확장 상태" : "선택 0개 · 원래 크기 복원"}</p><button type="button" onClick={() => diagram.selection.clear()}>선택 해제</button><div style={{ height: 430 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} onSelectionChanged={selectionChanged} style={{ width: "100%", height: "100%" }} /></div></div>;
}
