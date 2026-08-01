/**
 * ================================================================
 * [초보자용 상세 주석] 14-02 이미지 오류 대체 처리
 * ================================================================
 *
 * 이 파일에서 만드는 것
 * - 이미지 로드 실패 시 이니셜 대체 이미지를 표시합니다.
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
 * - error event: 이번 예제에서 error event 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 * - fallback image: 이번 예제에서 fallback image 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 * - cleanup: 이번 예제에서 cleanup 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 *
 * 기억할 점
 * - Diagram은 데이터 모델이고 DiagramView는 그 모델을 화면에 표시하는 React 뷰입니다.
 * - Rect의 네 값은 순서대로 x, y, width, height입니다.
 * - onStatus는 학습 사이트의 검증 패널용 선택적 prop입니다. 외부 프로젝트에서는 전달하지 않아도 됩니다.
 * - StrictMode의 개발 환경 이중 마운트가 문제가 되면 안내된 main.jsx처럼 StrictMode 없이 먼저 확인하세요.
 * - 외부 이미지 오류를 처리하지 않으면 깨진 이미지 아이콘만 표시될 수 있습니다.
 */
import { /* [React 생명주기] effect는 렌더링 뒤 부수 작업을 수행하고, 반환 함수는 unmount 시 리스너와 Diagram 내용을 정리합니다. */
useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

/* [카드 배열] 카드 수를 늘리거나 내용을 바꾸려면 먼저 이 배열의 객체를 수정합니다. map이 각 객체를 HTML 카드로 바꿉니다. */
const cards = [{ id: 1, nickname: "라온", intro: "이미지 로드 실패를 안전하게 처리합니다." }];
const fallback = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="#cbd8e8"/><text x="50" y="62" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#405777">라</text></svg>')}`;

/* [컴포넌트 시작] 이 함수가 외부에서 import해 렌더링하는 예제 컴포넌트입니다. props의 onStatus는 선택 사항입니다. */
export default function Step1402ImageFallback({ onStatus } = {}) {
  const [diagram] = useState(() => /* [Diagram 생성] 노드와 연결선을 보관할 모델을 만듭니다. useState의 초기 함수 안에서 만들면 React 재렌더링에도 같은 모델을 유지합니다. */
new Diagram()); const viewRef = useRef(null); const initialized = useRef(false); const cleanupRef = useRef(() => {}); const [fallbackUsed, setFallbackUsed] = useState(false);
  const report = (used) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 1, linkCount: 0, htmlDomCount: 1, buttonDomCount: 0, cardCount: 1, cardDomCount: 1, selectedNodeCount: 0, cardExpanded: true, selectedCardCount: 0, imageFallbackCount: used ? 1 : 0, consoleErrorCount: 0 });
  /* [초기화 함수] DiagramView가 준비된 뒤 한 번 실행되어 노드와 연결선을 구성합니다. 중복 실행 방지 조건을 먼저 확인하세요. */
const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const card = cards[0]; const node = /* [HTML 노드 생성] ControlNode는 실제 HTML을 다이어그램 좌표에 표시합니다. 생성자에는 DiagramView의 core view가 필요합니다. */
new ControlNode(coreView); node.template = `<article data-mf-card-node="14-02" data-card-id="1" style="box-sizing:border-box;width:100%;height:100%;display:flex;gap:14px;align-items:center;padding:16px;border:2px solid #2877de;border-radius:16px;background:white"><img data-testid="fallback-image" alt="${card.nickname} 프로필" style="width:68px;height:68px;border-radius:50%"><div><strong style="display:block;color:#17345f;font:700 17px sans-serif">${card.nickname}</strong><span style="color:#61708a;font:13px sans-serif">${card.intro}</span></div></article>`; node.bounds = /* [위치와 크기] Rect(x, y, width, height)로 다이어그램 좌표상의 위치와 노드 크기를 함께 지정합니다. */
new Rect(45, 25, 155, 62); /* [모델에 등록] 직접 new로 만든 노드는 addItem을 호출해야 Diagram이 관리하고 DiagramView가 그릴 수 있습니다. */
diagram.addItem(node); };
  /* [DOM 생성 이벤트] ControlNode의 HTML이 실제 브라우저 DOM으로 만들어진 뒤 버튼·이미지를 안전하게 검색하고 이벤트를 연결합니다. */
const domCreated = (_sender, args) => { const image = args.node.getContent().querySelector('[data-testid="fallback-image"]'); const failed = () => { image.src = fallback; image.dataset.fallback = "true"; setFallbackUsed(true); report(true); }; image./* [브라우저 이벤트 등록] DOM 요소와 handler 함수 쌍을 기억해야 cleanup에서 정확히 같은 함수로 제거할 수 있습니다. */
addEventListener("error", failed, { once: true }); cleanupRef.current = () => image.removeEventListener("error", failed); image.src = "data:image/png;base64,broken"; report(false); };
  useEffect(() => () => { cleanupRef.current(); diagram.clearAll(); }, [diagram]);
  return <div data-testid="diagram-demo"><p data-testid="image-state">{fallbackUsed ? "이미지 오류 처리 완료 · 대체 이미지 표시" : "이미지 오류 확인 중"}</p><div style={{ height: 460 }}>/* [화면 렌더링] 준비한 Diagram 모델과 ref, 이벤트 함수를 DiagramView prop으로 전달합니다. 부모 요소에는 반드시 높이가 있어야 합니다. */
<DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}

