import { useEffect, useRef, useState } from "react";
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

export default function Step1101ButtonClick({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram());
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

  const initialize = () => {
    if (initialized.current) return;
    const coreView = viewRef.current?.find();
    if (!coreView) return;
    initialized.current = true;
    const node = new ControlNode(coreView);
    node.template = createTemplate();
    node.bounds = new Rect(34, 20, 230, 118);
    diagram.addItem(node);
  };

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
      button.addEventListener("click", handler);
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
        <DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
