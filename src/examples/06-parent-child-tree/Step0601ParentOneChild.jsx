import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0601ParentOneChild({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const node = (text, x, y, expandable = false) => { const item = new ShapeNode(model); item.bounds = new Rect(x, y, 52, 28); item.text = text; item.expandable = expandable; item.expanded = expandable; model.addItem(item); return item; };
    const parent = node("부모", 82, 20, true); const child = node("자식 1", 82, 92);
    model.factory.createDiagramLink(parent, child);
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 2, linkCount: 1, visibleNodeCount: 2, visibleLinkCount: 1, expandedNodeCount: 1, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
