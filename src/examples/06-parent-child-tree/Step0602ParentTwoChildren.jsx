import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0602ParentTwoChildren({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram(); const make = (text, x, y, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(x, y, 52, 28); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; };
    const root = make("부모", 82, 18, true); [make("자식 1", 30, 92), make("자식 2", 134, 92)].forEach((child) => model.factory.createDiagramLink(root, child)); return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 3, linkCount: 2, visibleNodeCount: 3, visibleLinkCount: 2, expandedNodeCount: 1, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
