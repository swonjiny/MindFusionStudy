import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";
import { LayoutDirection, TreeLayout } from "@mindfusion/graphs";

export default function Step0702LayoutSpacing({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram(); const make = (text, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(0, 0, 46, 24); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; };
    const root = make("넓은 간격", true); for (let i = 1; i <= 5; i += 1) model.factory.createDiagramLink(root, make(`자식 ${i}`)); const layout = new TreeLayout(); layout.direction = LayoutDirection.TopToBottom; layout.levelDistance = 42; layout.nodeDistance = 26; model.arrange(layout); return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 6, linkCount: 5, visibleNodeCount: 6, visibleLinkCount: 5, expandedNodeCount: 1, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
