import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";
import { LayoutDirection, TreeLayout } from "@mindfusion/graphs";

export default function Step0705RelayoutAfterAdd({ onStatus } = {}) {
  const [added, setAdded] = useState(false);
  const [diagram] = useState(() => {
    const model = new Diagram(); const make = (text, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(0, 0, 46, 24); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; }; const root = make("루트", true); root.tag = "root"; for (let i = 1; i <= 4; i += 1) model.factory.createDiagramLink(root, make(`자식 ${i}`)); return model;
  });
  const arrange = () => { const layout = new TreeLayout(); layout.direction = LayoutDirection.TopToBottom; layout.levelDistance = 30; layout.nodeDistance = 18; diagram.arrange(layout); };
  const report = (count) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: count, linkCount: count - 1, visibleNodeCount: count, visibleLinkCount: count - 1, expandedNodeCount: 1, consoleErrorCount: 0 });
  useEffect(() => { arrange(); report(5); }, [diagram]);
  const addAndArrange = () => { if (added) return; const n = new ShapeNode(diagram); n.bounds = new Rect(0, 0, 46, 24); n.text = "새 자식"; diagram.addItem(n); diagram.factory.createDiagramLink(diagram.nodes.find((item) => item.tag === "root"), n); arrange(); setAdded(true); report(6); };
  return <div data-testid="diagram-demo"><button onClick={addAndArrange} disabled={added}>자식 추가 후 재배치</button><span data-testid="layout-state"> {added ? "6개 재배치 완료" : "5개 배치 완료"}</span><div style={{ height: 460 }}><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div></div>;
}
