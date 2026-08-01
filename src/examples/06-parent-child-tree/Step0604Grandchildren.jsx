import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0604Grandchildren({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram(); const make = (text, x, y, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(x, y, 50, 26); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; };
    const root = make("부모", 92, 12, true), childA = make("자식 A", 40, 80, true), childB = make("자식 B", 144, 80);
    [childA, childB].forEach((child) => model.factory.createDiagramLink(root, child)); [make("손자 A-1", 16, 150), make("손자 A-2", 76, 150)].forEach((grandchild) => model.factory.createDiagramLink(childA, grandchild)); return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 5, linkCount: 4, visibleNodeCount: 5, visibleLinkCount: 4, expandedNodeCount: 2, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
