import { useEffect, useRef, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0405NodeDoubleClick({ onStatus } = {}) {
  const [eventText, setEventText] = useState("아직 발생하지 않음");
  const eventCount = useRef(0);
  const [diagram] = useState(() => {
    const model = new Diagram();
    ["노드 A", "노드 B"].forEach((text, index) => { const node = new ShapeNode(model); node.bounds = new Rect(28 + index * 76, 36, 56, 34); node.text = text; model.addItem(node); });
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 2, linkCount: 0, selectedNodeCount: 0, eventCount: 0, lastEvent: eventText, consoleErrorCount: 0 }); }, [diagram]);
  const doubled = (_sender, args) => { eventCount.current += 1; const next = `더블 클릭: ${args.node.text}`; setEventText(next); onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 2, linkCount: 0, selectedNodeCount: diagram.selection.nodes.length, eventCount: eventCount.current, lastEvent: next, consoleErrorCount: 0 }); };
  return <div data-testid="diagram-demo"><p><span data-testid="event-count">이벤트 {eventCount.current}회</span> · <span data-testid="last-event">{eventText}</span></p><div style={{ height: 460 }}><DiagramView diagram={diagram} behavior={Behavior.Modify} onNodeDoubleClicked={doubled} style={{ width: "100%", height: "100%" }} /></div></div>;
}
