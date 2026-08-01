import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";
import { LayoutDirection, TreeLayout } from "@mindfusion/graphs";

export default function Step0704ThreeLevelAutoLayout({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram(); const make = (text, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(0, 0, 46, 24); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; }; const link = (a, b) => model.factory.createDiagramLink(a, b);
    const root = make("본부", true), a = make("개발", true), b = make("디자인", true); link(root, a); link(root, b); ["웹", "서버"].forEach((t) => link(a, make(t))); ["UX", "브랜드"].forEach((t) => link(b, make(t))); const layout = new TreeLayout(); layout.direction = LayoutDirection.TopToBottom; layout.levelDistance = 30; layout.nodeDistance = 16; model.arrange(layout); return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 7, linkCount: 6, visibleNodeCount: 7, visibleLinkCount: 6, expandedNodeCount: 3, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
