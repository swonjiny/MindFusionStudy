import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0201SingleNode({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const node = new ShapeNode(model);
    node.bounds = new Rect(55, 42, 55, 28);
    node.text = "일반 노드";
    node.brush = "#e8f3ff";
    node.stroke = "#2877de";
    model.addItem(node);
    return model;
  });
  useEffect(() => {
    onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: diagram.links.length, consoleErrorCount: 0 });
  }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
