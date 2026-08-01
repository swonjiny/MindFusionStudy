import { useEffect, useRef, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0404SelectionChanged({ onStatus } = {}) {
  const [summary, setSummary] = useState({ count: 0, selected: 0, text: "아직 발생하지 않음" });
  const eventCount = useRef(0);
  const [diagram] = useState(() => {
    const model = new Diagram(); model.allowMultipleSelection = true;
    ["노드 A", "노드 B", "노드 C"].forEach((text, index) => { const node = new ShapeNode(model); node.bounds = new Rect(15 + index * 58, 36, 48, 34); node.text = text; model.addItem(node); });
    return model;
  });
  const notify = (next) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 3, linkCount: 0, selectedNodeCount: next.selected, eventCount: next.count, lastEvent: next.text, consoleErrorCount: 0 });
  useEffect(() => { notify(summary); }, [diagram]);
  const changed = (_sender, args) => { eventCount.current += 1; const selected = diagram.selection.nodes.length; const next = { count: eventCount.current, selected, text: `선택 변경: ${args.oldItems.length} → ${args.newItems.length}` }; setSummary(next); notify(next); };
  const select = async (count) => { diagram.selection.clear(); for (const node of diagram.nodes.slice(0, count)) await diagram.selection.addItem(node); };
  return <div data-testid="diagram-demo"><p><span data-testid="event-count">이벤트 {summary.count}회</span> · <span data-testid="selected-count">선택 {summary.selected}개</span> · <span data-testid="last-event">{summary.text}</span></p><button onClick={() => select(1)}>첫 노드 선택</button> <button onClick={() => select(2)}>두 노드 선택</button> <button onClick={() => diagram.selection.clear()}>선택 해제</button><div style={{ height: 430 }}><DiagramView diagram={diagram} behavior={Behavior.Modify} onSelectionChanged={changed} style={{ width: "100%", height: "100%" }} /></div></div>;
}
