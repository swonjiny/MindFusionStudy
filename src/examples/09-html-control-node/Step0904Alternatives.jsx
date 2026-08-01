/**
 * ================================================================
 * [초보자용 상세 주석] 09-04 ControlNode 대체 방식 비교
 * ================================================================
 *
 * 이 파일에서 만드는 것
 * - ControlNode, CompositeNode, React Portal, 외부 DOM Overlay를 실제 렌더링해 비교합니다.
 * - 예상 결과: 노드 2개, 연결선 0개
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
 * - ControlNode: Diagram 위에 실제 HTML DOM을 표시하는 노드입니다.
 * - CompositeNode: 여러 시각 요소를 조합해 구성하는 MindFusion 노드입니다.
 * - createPortal: 이번 예제에서 createPortal 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 * - DOM Overlay: 이번 예제에서 DOM Overlay 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 *
 * 기억할 점
 * - Diagram은 데이터 모델이고 DiagramView는 그 모델을 화면에 표시하는 React 뷰입니다.
 * - Rect의 네 값은 순서대로 x, y, width, height입니다.
 * - onStatus는 학습 사이트의 검증 패널용 선택적 prop입니다. 외부 프로젝트에서는 전달하지 않아도 됩니다.
 * - StrictMode의 개발 환경 이중 마운트가 문제가 되면 안내된 main.jsx처럼 StrictMode 없이 먼저 확인하세요.
 * - ControlNode 생성자에 core view를 전달하지 않거나 부모 높이가 0이면 흰색 빈 영역만 보일 수 있습니다.
 */
import { /* [React 생명주기] effect는 렌더링 뒤 부수 작업을 수행하고, 반환 함수는 unmount 시 리스너와 Diagram 내용을 정리합니다. */
useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Behavior, CompositeNode, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

const ComparisonComposite = CompositeNode.classFromTemplate("ComparisonComposite", {
  component: "GridPanel", children: [
    { component: "Rect", pen: "#6b7c93", brush: "#f3f6fa", radius: 6 },
    { component: "Text", text: "CompositeNode\n(canvas)", font: "Arial 12", textColor: "#23344d", horizontalAlignment: "Center", verticalAlignment: "Center" },
  ],
});

/* [컴포넌트 시작] 이 함수가 외부에서 import해 렌더링하는 예제 컴포넌트입니다. props의 onStatus는 선택 사항입니다. */
export default function Step0904Alternatives({ onStatus } = {}) {
  const [diagram] = useState(() => /* [Diagram 생성] 노드와 연결선을 보관할 모델을 만듭니다. useState의 초기 함수 안에서 만들면 React 재렌더링에도 같은 모델을 유지합니다. */
new Diagram()); const viewRef = useRef(null); const initialized = useRef(false); const [portalHost, setPortalHost] = useState(null);
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, htmlDomCount: document.querySelectorAll('[data-alternative="control"], [data-alternative="portal"], [data-alternative="overlay"]').length, buttonDomCount: 0, consoleErrorCount: 0 });
  /* [초기화 함수] DiagramView가 준비된 뒤 한 번 실행되어 노드와 연결선을 구성합니다. 중복 실행 방지 조건을 먼저 확인하세요. */
const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const control = /* [HTML 노드 생성] ControlNode는 실제 HTML을 다이어그램 좌표에 표시합니다. 생성자에는 DiagramView의 core view가 필요합니다. */
new ControlNode(coreView); control.template = '<div data-alternative="control" style="box-sizing:border-box;width:100%;height:100%;display:grid;place-items:center;border:2px solid #2877de;border-radius:8px;background:#eef6ff;font:600 13px sans-serif">ControlNode<br/>HTML DOM</div>'; control.bounds = /* [위치와 크기] Rect(x, y, width, height)로 다이어그램 좌표상의 위치와 노드 크기를 함께 지정합니다. */
new Rect(15, 28, 75, 48); /* [모델에 등록] 직접 new로 만든 노드는 addItem을 호출해야 Diagram이 관리하고 DiagramView가 그릴 수 있습니다. */
diagram.addItem(control); const composite = new ComparisonComposite(diagram); composite.bounds = new Rect(110, 28, 75, 48); diagram.addItem(composite); };
  /* [DOM 생성 이벤트] ControlNode의 HTML이 실제 브라우저 DOM으로 만들어진 뒤 버튼·이미지를 안전하게 검색하고 이벤트를 연결합니다. */
const domCreated = () => setTimeout(report, 0);
  useEffect(() => { if (portalHost) queueMicrotask(report); }, [portalHost]);
  useEffect(() => () => diagram.clearAll(), [diagram]);
  const overlayStyle = { position: "absolute", zIndex: 20, boxSizing: "border-box", width: 130, height: 62, display: "grid", placeItems: "center", borderRadius: 8, font: "600 13px sans-serif", textAlign: "center", pointerEvents: "auto" };
  return <div data-testid="diagram-demo"><p>네 방식을 동시에 렌더링해 실제 DOM 생성 여부를 비교합니다.</p><div style={{ position: "relative", height: 460 }}>/* [화면 렌더링] 준비한 Diagram 모델과 ref, 이벤트 함수를 DiagramView prop으로 전달합니다. 부모 요소에는 반드시 높이가 있어야 합니다. */
<DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /><div ref={setPortalHost} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />{portalHost && createPortal(<div data-alternative="portal" style={{ ...overlayStyle, left: 58, top: 245, border: "2px solid #7c4dff", background: "#f3efff" }}>React Portal<br/>HTML DOM</div>, portalHost)}<div data-alternative="overlay" style={{ ...overlayStyle, left: 220, top: 245, border: "2px solid #dc6b19", background: "#fff4e8" }}>외부 Overlay<br/>HTML DOM</div></div></div>;
}

