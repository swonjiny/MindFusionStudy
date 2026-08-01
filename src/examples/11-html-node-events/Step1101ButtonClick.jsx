/**
 * ================================================================
 * [초보자용 상세 주석] 11-01 HTML 버튼 클릭 이벤트
 * ================================================================
 *
 * 이 파일에서 만드는 것
 * - 세 버튼이 서로 다른 메시지를 표시하며 같은 버튼을 다시 누르면 메시지를 숨깁니다.
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
 * - addEventListener: HTML 요소에 클릭 같은 브라우저 이벤트 함수를 연결합니다.
 * - click: 이번 예제에서 click 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 * - aria-pressed: 이번 예제에서 aria-pressed 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 * - toggle: 이번 예제에서 toggle 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 *
 * 기억할 점
 * - Diagram은 데이터 모델이고 DiagramView는 그 모델을 화면에 표시하는 React 뷰입니다.
 * - Rect의 네 값은 순서대로 x, y, width, height입니다.
 * - onStatus는 학습 사이트의 검증 패널용 선택적 prop입니다. 외부 프로젝트에서는 전달하지 않아도 됩니다.
 * - StrictMode의 개발 환경 이중 마운트가 문제가 되면 안내된 main.jsx처럼 StrictMode 없이 먼저 확인하세요.
 * - 렌더링할 때마다 새 리스너를 추가하면 한 번 클릭해도 여러 번 실행될 수 있습니다.
 */
import { /* [React 생명주기] effect는 렌더링 뒤 부수 작업을 수행하고, 반환 함수는 unmount 시 리스너와 Diagram 내용을 정리합니다. */
useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

const buttonMessages = [
  { id: "select", label: "선택", message: "현재 선택한 버튼은 ‘선택’ 버튼입니다." },
  { id: "status", label: "상태 확인", message: "현재 노드는 정상적으로 실행 중입니다." },
  { id: "help", label: "도움말", message: "같은 버튼을 다시 누르면 이 메시지가 사라집니다." },
];

const createTemplate = () => `
  <div data-mf-html-node="11-01" style="box-sizing:border-box;width:100%;height:100%;padding:14px;border:1px solid #9abce9;border-radius:12px;background:white;font-family:sans-serif">
    <strong style="display:block;margin-bottom:10px;color:#17345f">서로 다른 버튼 이벤트</strong>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${buttonMessages.map(({ id, label, message }) => `<button data-testid="control-${id}-button" data-button-id="${id}" data-message="${message}" data-interactive="true" aria-pressed="false" type="button" style="padding:7px 11px;border:1px solid #2468d6;border-radius:7px;background:#fff;color:#2468d6;cursor:pointer">${label}</button>`).join("")}
    </div>
    <p data-testid="control-button-message" role="status" hidden style="margin:10px 0 0;padding:8px;border-radius:7px;background:#eaf3ff;color:#174f98;font-size:12px"></p>
  </div>`;

/* [컴포넌트 시작] 이 함수가 외부에서 import해 렌더링하는 예제 컴포넌트입니다. props의 onStatus는 선택 사항입니다. */
export default function Step1101ButtonClick({ onStatus } = {}) {
  const [diagram] = useState(() => /* [Diagram 생성] 노드와 연결선을 보관할 모델을 만듭니다. useState의 초기 함수 안에서 만들면 React 재렌더링에도 같은 모델을 유지합니다. */
new Diagram());
  const viewRef = useRef(null);
  const initialized = useRef(false);
  const listeners = useRef(new Map());
  const clickCount = useRef(0);
  const [clicks, setClicks] = useState(0);

  const report = (eventCount = 0, lastEvent = "클릭 대기 중") => onStatus?.({
    diagramReady: true,
    viewReady: true,
    rendered: true,
    nodeCount: diagram.nodes.length,
    linkCount: 0,
    htmlDomCount: 1,
    buttonDomCount: 3,
    eventCount,
    lastEvent,
    consoleErrorCount: 0,
  });

  /* [초기화 함수] DiagramView가 준비된 뒤 한 번 실행되어 노드와 연결선을 구성합니다. 중복 실행 방지 조건을 먼저 확인하세요. */
const initialize = () => {
    if (initialized.current) return;
    const coreView = viewRef.current?.find();
    if (!coreView) return;
    initialized.current = true;
    const node = /* [HTML 노드 생성] ControlNode는 실제 HTML을 다이어그램 좌표에 표시합니다. 생성자에는 DiagramView의 core view가 필요합니다. */
new ControlNode(coreView);
    node.template = createTemplate();
    node.bounds = /* [위치와 크기] Rect(x, y, width, height)로 다이어그램 좌표상의 위치와 노드 크기를 함께 지정합니다. */
new Rect(34, 20, 230, 118);
    /* [모델에 등록] 직접 new로 만든 노드는 addItem을 호출해야 Diagram이 관리하고 DiagramView가 그릴 수 있습니다. */
diagram.addItem(node);
  };

  /* [DOM 생성 이벤트] ControlNode의 HTML이 실제 브라우저 DOM으로 만들어진 뒤 버튼·이미지를 안전하게 검색하고 이벤트를 연결합니다. */
const domCreated = (_sender, args) => {
    const root = args.node.getContent();
    const message = root.querySelector('[data-testid="control-button-message"]');
    root.querySelectorAll("[data-button-id]").forEach((button) => {
      if (listeners.current.has(button)) return;
      const handler = (event) => {
        event.stopPropagation();
        const isActive = button.getAttribute("aria-pressed") === "true";
        root.querySelectorAll("[data-button-id]").forEach((item) => {
          item.setAttribute("aria-pressed", "false");
          item.style.background = "#fff";
          item.style.color = "#2468d6";
        });
        if (isActive) {
          message.hidden = true;
          message.textContent = "";
        } else {
          button.setAttribute("aria-pressed", "true");
          button.style.background = "#2468d6";
          button.style.color = "#fff";
          message.textContent = button.dataset.message;
          message.hidden = false;
        }
        clickCount.current += 1;
        setClicks(clickCount.current);
        report(clickCount.current, isActive ? `${button.textContent} 메시지 숨김` : `${button.textContent} 메시지 표시`);
      };
      button./* [브라우저 이벤트 등록] DOM 요소와 handler 함수 쌍을 기억해야 cleanup에서 정확히 같은 함수로 제거할 수 있습니다. */
addEventListener("click", handler);
      listeners.current.set(button, handler);
    });
    report(0);
  };

  useEffect(() => () => {
    listeners.current.forEach((handler, element) => element.removeEventListener("click", handler));
    listeners.current.clear();
    diagram.clearAll();
  }, [diagram]);

  return (
    <div data-testid="diagram-demo">
      <p data-testid="button-click-count">버튼 클릭 {clicks}회</p>
      <div style={{ height: 460 }}>
        /* [화면 렌더링] 준비한 Diagram 모델과 ref, 이벤트 함수를 DiagramView prop으로 전달합니다. 부모 요소에는 반드시 높이가 있어야 합니다. */
<DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

