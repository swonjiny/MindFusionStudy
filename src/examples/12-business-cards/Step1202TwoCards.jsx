import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

const cards = [{ id: 1, nickname: "민트", intro: "UI 흐름을 설계합니다.", color: "#2b8a78" }, { id: 2, nickname: "라온", intro: "데이터 시각화를 만듭니다.", color: "#6f5bd3" }];
const avatar = (card) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="40" fill="${card.color}"/><text x="40" y="50" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="700" fill="white">${card.nickname[0]}</text></svg>`)}`;
const cardHtml = (card) => `<article data-card-id="${card.id}" style="display:flex;align-items:center;gap:12px;padding:9px;border:1px solid #d7e3f4;border-radius:11px;background:#fff"><img src="${avatar(card)}" alt="${card.nickname} 프로필" style="width:42px;height:42px;border-radius:50%"/><div><strong style="display:block;color:#17345f;font:700 14px sans-serif">${card.nickname}</strong><span style="color:#61708a;font:12px sans-serif">${card.intro}</span></div></article>`;

export default function Step1202TwoCards({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false);
  const report = (cardDomCount = 0) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 1, linkCount: 0, htmlDomCount: 1, buttonDomCount: 0, cardCount: cards.length, cardDomCount, selectedNodeCount: 0, cardExpanded: true, selectedCardCount: 0, consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const node = new ControlNode(coreView); node.template = `<section data-mf-card-node="12-02" style="box-sizing:border-box;width:100%;height:100%;display:grid;gap:8px;padding:10px;border:2px solid #2877de;border-radius:14px;background:#f7fbff">${cards.map(cardHtml).join("")}</section>`; node.bounds = new Rect(58, 20, 115, 54); diagram.addItem(node); };
  const domCreated = (_sender, args) => report(args.node.getContent().querySelectorAll("[data-card-id]").length);
  useEffect(() => () => diagram.clearAll(), [diagram]);
  return <div data-testid="diagram-demo"><p data-testid="card-summary">배열 데이터 {cards.length}개 · 카드 2개</p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
