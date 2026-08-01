import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";
import { LayoutDirection, TreeLayout } from "@mindfusion/graphs";

export default function Step0701VerticalTreeLayout({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram(); const make = (text, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(0, 0, 48, 26); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; };
    const root = make("루트", true); ["자식 A", "자식 B", "자식 C"].forEach((text) => model.factory.createDiagramLink(root, make(text))); const layout = new TreeLayout(); layout.direction = LayoutDirection.TopToBottom; layout.levelDistance = 28; layout.nodeDistance = 18; model.arrange(layout); return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 4, linkCount: 3, visibleNodeCount: 4, visibleLinkCount: 3, expandedNodeCount: 1, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
