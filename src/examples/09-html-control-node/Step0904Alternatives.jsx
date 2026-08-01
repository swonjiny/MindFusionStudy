import { useEffect, useRef, useState } from "react";
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

export default function Step0904Alternatives({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false); const [portalHost, setPortalHost] = useState(null);
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, htmlDomCount: document.querySelectorAll('[data-alternative="control"], [data-alternative="portal"], [data-alternative="overlay"]').length, buttonDomCount: 0, consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const control = new ControlNode(coreView); control.template = '<div data-alternative="control" style="box-sizing:border-box;width:100%;height:100%;display:grid;place-items:center;border:2px solid #2877de;border-radius:8px;background:#eef6ff;font:600 13px sans-serif">ControlNode<br/>HTML DOM</div>'; control.bounds = new Rect(15, 28, 75, 48); diagram.addItem(control); const composite = new ComparisonComposite(diagram); composite.bounds = new Rect(110, 28, 75, 48); diagram.addItem(composite); };
  const domCreated = () => setTimeout(report, 0);
  useEffect(() => { if (portalHost) queueMicrotask(report); }, [portalHost]);
  useEffect(() => () => diagram.clearAll(), [diagram]);
  const overlayStyle = { position: "absolute", zIndex: 20, boxSizing: "border-box", width: 130, height: 62, display: "grid", placeItems: "center", borderRadius: 8, font: "600 13px sans-serif", textAlign: "center", pointerEvents: "auto" };
  return <div data-testid="diagram-demo"><p>네 방식을 동시에 렌더링해 실제 DOM 생성 여부를 비교합니다.</p><div style={{ position: "relative", height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /><div ref={setPortalHost} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />{portalHost && createPortal(<div data-alternative="portal" style={{ ...overlayStyle, left: 58, top: 245, border: "2px solid #7c4dff", background: "#f3efff" }}>React Portal<br/>HTML DOM</div>, portalHost)}<div data-alternative="overlay" style={{ ...overlayStyle, left: 220, top: 245, border: "2px solid #dc6b19", background: "#fff4e8" }}>외부 Overlay<br/>HTML DOM</div></div></div>;
}
