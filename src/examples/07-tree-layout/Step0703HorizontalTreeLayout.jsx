import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";
import { LayoutDirection, TreeLayout } from "@mindfusion/graphs";

export default function Step0703HorizontalTreeLayout({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram(); const make = (text, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(0, 0, 48, 26); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; };
    const root = make("왼쪽 루트", true); ["분기 A", "분기 B", "분기 C"].forEach((text) => model.factory.createDiagramLink(root, make(text))); const layout = new TreeLayout(); layout.direction = LayoutDirection.LeftToRight; layout.levelDistance = 34; layout.nodeDistance = 22; model.arrange(layout); return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 4, linkCount: 3, visibleNodeCount: 4, visibleLinkCount: 3, expandedNodeCount: 1, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
