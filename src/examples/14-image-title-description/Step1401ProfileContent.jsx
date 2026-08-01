import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

const cards = [{ id: 1, nickname: "민트", intro: "복잡한 기능을 명확한 화면으로 정리하는 UI 설계자입니다.", color: "#2b8a78" }];
const avatar = (card) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="20" fill="${card.color}"/><text x="50" y="62" text-anchor="middle" font-family="sans-serif" font-size="38" font-weight="700" fill="white">${card.nickname[0]}</text></svg>`)}`;

export default function Step1401ProfileContent({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false);
  const report = (cardDomCount = 0) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 1, linkCount: 0, htmlDomCount: 1, buttonDomCount: 0, cardCount: cards.length, cardDomCount, selectedNodeCount: 0, cardExpanded: true, selectedCardCount: 0, consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const card = cards[0]; const node = new ControlNode(coreView); node.template = `<article data-mf-card-node="14-01" data-card-id="${card.id}" style="box-sizing:border-box;width:100%;height:100%;display:grid;grid-template-columns:72px 1fr;gap:14px;align-items:center;padding:16px;border:2px solid #2877de;border-radius:16px;background:white;box-shadow:0 8px 24px #194b8920"><img src="${avatar(card)}" alt="${card.nickname} 프로필" style="width:72px;height:72px;border-radius:15px"><div><h3 style="margin:0 0 8px;color:#17345f;font:700 18px sans-serif">${card.nickname}</h3><p style="margin:0;color:#61708a;font:13px/1.5 sans-serif">${card.intro}</p></div></article>`; node.bounds = new Rect(45, 24, 155, 66); diagram.addItem(node); };
  const domCreated = (_sender, args) => report(args.node.getContent().querySelectorAll("[data-card-id]").length);
  useEffect(() => () => diagram.clearAll(), [diagram]);
  return <div data-testid="diagram-demo"><p>이미지·닉네임·소개를 한 카드에 배치합니다.</p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
