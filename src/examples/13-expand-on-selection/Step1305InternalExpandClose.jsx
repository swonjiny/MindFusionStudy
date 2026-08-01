import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

const cards = [
  { id: 1, nickname: "민트", intro: "UI 설계" },
  { id: 2, nickname: "라온", intro: "시각화" },
  { id: 3, nickname: "하루", intro: "UX 연구" },
  { id: 4, nickname: "소담", intro: "콘텐츠" },
  { id: 5, nickname: "노을", intro: "접근성" },
];

const collapsedBounds = new Rect(66, 40, 122, 48);
const expandedBounds = new Rect(45, 2, 150, 136);

const collapsedHtml = () => `
  <section data-mf-card-node="13-05" data-expanded="false" style="box-sizing:border-box;width:100%;height:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px;border:2px solid #8ba9d0;border-radius:14px;background:#f7fbff;font-family:sans-serif">
    <div><strong style="display:block;color:#17345f">팀 카드 5명</strong><span style="color:#61708a;font-size:11px">축약 상태</span></div>
    <button data-testid="internal-expand-button" data-action="expand" data-interactive="true" type="button" style="padding:7px 11px;border:0;border-radius:7px;background:#2468d6;color:white;cursor:pointer">펼치기</button>
  </section>`;

const expandedHtml = () => `
  <section data-mf-card-node="13-05" data-expanded="true" style="box-sizing:border-box;width:100%;height:100%;display:grid;grid-template-rows:auto 1fr;gap:6px;padding:8px;border:3px solid #2468d6;border-radius:14px;background:#edf5ff;font-family:sans-serif">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:8px"><strong style="color:#17345f">팀 카드 5명</strong><button data-testid="internal-close-button" data-action="close" data-interactive="true" type="button" aria-label="펼쳐진 카드 닫기" style="padding:6px 10px;border:1px solid #7fa8dd;border-radius:7px;background:white;color:#174f98;cursor:pointer">닫기</button></header>
    <div style="display:grid;gap:5px">${cards.map((card) => `<article data-card-id="${card.id}" style="padding:6px 9px;border-radius:8px;background:white"><strong style="color:#17345f">${card.nickname}</strong><span style="margin-left:10px;color:#61708a;font-size:12px">${card.intro}</span></article>`).join("")}</div>
  </section>`;

export default function Step1305InternalExpandClose({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram());
  const viewRef = useRef(null);
  const initialized = useRef(false);
  const nodeRef = useRef(null);
  const cleanupRef = useRef(null);
  const events = useRef(0);
  const [expanded, setExpanded] = useState(false);

  const report = (isExpanded, lastEvent = "펼치기 대기") => onStatus?.({
    diagramReady: true,
    viewReady: true,
    rendered: true,
    nodeCount: 1,
    linkCount: 0,
    htmlDomCount: 1,
    buttonDomCount: 1,
    cardCount: cards.length,
    cardDomCount: isExpanded ? cards.length : 0,
    selectedNodeCount: 0,
    cardExpanded: isExpanded,
    selectedCardCount: 0,
    eventCount: events.current,
    lastEvent,
    consoleErrorCount: 0,
  });

  const renderState = (isExpanded) => {
    const node = nodeRef.current;
    const content = node?.getContent?.();
    if (!node || !content) return;
    content.innerHTML = isExpanded ? expandedHtml() : collapsedHtml();
    node.bounds = isExpanded ? expandedBounds : collapsedBounds;
    diagram.invalidate();
    setExpanded(isExpanded);
    events.current += 1;
    report(isExpanded, isExpanded ? "내부 펼치기 버튼 클릭" : "상단 닫기 버튼 클릭");
  };

  const initialize = () => {
    if (initialized.current) return;
    const coreView = viewRef.current?.find();
    if (!coreView) return;
    initialized.current = true;
    const node = new ControlNode(coreView);
    node.template = collapsedHtml();
    node.bounds = collapsedBounds;
    nodeRef.current = node;
    diagram.addItem(node);
  };

  const domCreated = (_sender, args) => {
    const content = args.node.getContent();
    const handler = (event) => {
      const button = event.target.closest?.("[data-action]");
      if (!button || !content.contains(button)) return;
      event.stopPropagation();
      renderState(button.dataset.action === "expand");
    };
    content.addEventListener("click", handler);
    cleanupRef.current = () => content.removeEventListener("click", handler);
    report(false);
  };

  useEffect(() => () => {
    cleanupRef.current?.();
    diagram.clearAll();
  }, [diagram]);

  return (
    <div data-testid="diagram-demo">
      <p data-testid="internal-expand-state">{expanded ? "5개 카드 펼침" : "축약 카드"}</p>
      <div style={{ height: 430 }}>
        <DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
