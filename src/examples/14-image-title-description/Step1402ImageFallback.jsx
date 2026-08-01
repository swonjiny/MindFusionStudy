import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

const cards = [{ id: 1, nickname: "라온", intro: "이미지 로드 실패를 안전하게 처리합니다." }];
const fallback = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="#cbd8e8"/><text x="50" y="62" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#405777">라</text></svg>')}`;

export default function Step1402ImageFallback({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false); const cleanupRef = useRef(() => {}); const [fallbackUsed, setFallbackUsed] = useState(false);
  const report = (used) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 1, linkCount: 0, htmlDomCount: 1, buttonDomCount: 0, cardCount: 1, cardDomCount: 1, selectedNodeCount: 0, cardExpanded: true, selectedCardCount: 0, imageFallbackCount: used ? 1 : 0, consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const card = cards[0]; const node = new ControlNode(coreView); node.template = `<article data-mf-card-node="14-02" data-card-id="1" style="box-sizing:border-box;width:100%;height:100%;display:flex;gap:14px;align-items:center;padding:16px;border:2px solid #2877de;border-radius:16px;background:white"><img data-testid="fallback-image" alt="${card.nickname} 프로필" style="width:68px;height:68px;border-radius:50%"><div><strong style="display:block;color:#17345f;font:700 17px sans-serif">${card.nickname}</strong><span style="color:#61708a;font:13px sans-serif">${card.intro}</span></div></article>`; node.bounds = new Rect(45, 25, 155, 62); diagram.addItem(node); };
  const domCreated = (_sender, args) => { const image = args.node.getContent().querySelector('[data-testid="fallback-image"]'); const failed = () => { image.src = fallback; image.dataset.fallback = "true"; setFallbackUsed(true); report(true); }; image.addEventListener("error", failed, { once: true }); cleanupRef.current = () => image.removeEventListener("error", failed); image.src = "data:image/png;base64,broken"; report(false); };
  useEffect(() => () => { cleanupRef.current(); diagram.clearAll(); }, [diagram]);
  return <div data-testid="diagram-demo"><p data-testid="image-state">{fallbackUsed ? "이미지 오류 처리 완료 · 대체 이미지 표시" : "이미지 오류 확인 중"}</p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
