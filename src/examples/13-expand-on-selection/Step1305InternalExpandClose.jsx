/**
 * ================================================================
 * [초보자용 상세 주석] 13-05 카드 내부 버튼으로 펼치기·닫기
 * ================================================================
 *
 * 이 파일에서 만드는 것
 * - 축약 카드의 펼치기 버튼과 확장 카드 상단의 닫기 버튼으로 상태를 전환합니다.
 * - 예상 결과: 노드 1개, 연결선 0개
 * - 이 JSX 파일은 프로젝트 내부 상대경로에 의존하지 않으므로 다른 React 프로젝트로 복사할 수 있습니다.
 *
 * 코드를 읽는 권장 순서
 * 1. import: React와 MindFusion에서 어떤 도구를 가져오는지 확인합니다.
 * 2. 상수·데이터: 노드에 넣을 값과 반복할 배열을 확인합니다.
 * 3. 컴포넌트 상태·ref: 화면이 기억할 값과 MindFusion 인스턴스를 확인합니다.
 * 4. 초기화 함수: Diagram, 노드와 연결선을 어떤 순서로 만드는지 확인합니다.
 * 5. 이벤트 함수: 클릭·선택·DOM 생성 뒤 어떤 상태가 바뀌는지 확인합니다.
 * 6. cleanup: 컴포넌트가 사라질 때 이벤트와 모델을 어떻게 정리하는지 확인합니다.
 * 7. return JSX: DiagramView에 model, ref와 이벤트 prop이 어떻게 전달되는지 확인합니다.
 *
 * 이번 예제의 핵심 용어
 * - data-action: 이번 예제에서 data-action 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 * - event delegation: 이번 예제에서 event delegation 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 * - Rect: x, y 위치와 width, height 크기를 함께 나타냅니다.
 * - data-interactive: HTML 요소의 클릭을 노드 드래그와 구분하기 위한 표시입니다.
 *
 * 기억할 점
 * - Diagram은 데이터 모델이고 DiagramView는 그 모델을 화면에 표시하는 React 뷰입니다.
 * - Rect의 네 값은 순서대로 x, y, width, height입니다.
 * - onStatus는 학습 사이트의 검증 패널용 선택적 prop입니다. 외부 프로젝트에서는 전달하지 않아도 됩니다.
 * - StrictMode의 개발 환경 이중 마운트가 문제가 되면 안내된 main.jsx처럼 StrictMode 없이 먼저 확인하세요.
 * - HTML만 바꾸고 bounds를 복원하지 않으면 닫힌 뒤에도 큰 빈 노드가 남습니다.
 */
import { /* [React 생명주기] effect는 렌더링 뒤 부수 작업을 수행하고, 반환 함수는 unmount 시 리스너와 Diagram 내용을 정리합니다. */
useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

/* [카드 배열] 카드 수를 늘리거나 내용을 바꾸려면 먼저 이 배열의 객체를 수정합니다. map이 각 객체를 HTML 카드로 바꿉니다. */
const cards = [
  { id: 1, nickname: "민트", intro: "UI 설계" },
  { id: 2, nickname: "라온", intro: "시각화" },
  { id: 3, nickname: "하루", intro: "UX 연구" },
  { id: 4, nickname: "소담", intro: "콘텐츠" },
  { id: 5, nickname: "노을", intro: "접근성" },
];

const collapsedBounds = /* [위치와 크기] Rect(x, y, width, height)로 다이어그램 좌표상의 위치와 노드 크기를 함께 지정합니다. */
new Rect(66, 40, 122, 48);
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

/* [컴포넌트 시작] 이 함수가 외부에서 import해 렌더링하는 예제 컴포넌트입니다. props의 onStatus는 선택 사항입니다. */
export default function Step1305InternalExpandClose({ onStatus } = {}) {
  const [diagram] = useState(() => /* [Diagram 생성] 노드와 연결선을 보관할 모델을 만듭니다. useState의 초기 함수 안에서 만들면 React 재렌더링에도 같은 모델을 유지합니다. */
new Diagram());
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

  /* [초기화 함수] DiagramView가 준비된 뒤 한 번 실행되어 노드와 연결선을 구성합니다. 중복 실행 방지 조건을 먼저 확인하세요. */
const initialize = () => {
    if (initialized.current) return;
    const coreView = viewRef.current?.find();
    if (!coreView) return;
    initialized.current = true;
    const node = /* [HTML 노드 생성] ControlNode는 실제 HTML을 다이어그램 좌표에 표시합니다. 생성자에는 DiagramView의 core view가 필요합니다. */
new ControlNode(coreView);
    node.template = collapsedHtml();
    node.bounds = collapsedBounds;
    nodeRef.current = node;
    /* [모델에 등록] 직접 new로 만든 노드는 addItem을 호출해야 Diagram이 관리하고 DiagramView가 그릴 수 있습니다. */
diagram.addItem(node);
  };

  /* [DOM 생성 이벤트] ControlNode의 HTML이 실제 브라우저 DOM으로 만들어진 뒤 버튼·이미지를 안전하게 검색하고 이벤트를 연결합니다. */
const domCreated = (_sender, args) => {
    const content = args.node.getContent();
    const handler = (event) => {
      const button = event.target.closest?.("[data-action]");
      if (!button || !content.contains(button)) return;
      event.stopPropagation();
      renderState(button.dataset.action === "expand");
    };
    content./* [브라우저 이벤트 등록] DOM 요소와 handler 함수 쌍을 기억해야 cleanup에서 정확히 같은 함수로 제거할 수 있습니다. */
addEventListener("click", handler);
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
        /* [화면 렌더링] 준비한 Diagram 모델과 ref, 이벤트 함수를 DiagramView prop으로 전달합니다. 부모 요소에는 반드시 높이가 있어야 합니다. */
<DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

