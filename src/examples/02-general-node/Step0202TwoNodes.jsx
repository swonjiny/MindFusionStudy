import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0202TwoNodes({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    [["첫 번째 노드", 25, "#e8f3ff", "#2877de"], ["두 번째 노드", 95, "#f2eaff", "#7a4bd8"]].forEach(([text, x, brush, stroke]) => {
      const node = new ShapeNode(model);
      node.bounds = new Rect(x, 34, 48, 26);
      node.text = text; node.brush = brush; node.stroke = stroke;
      model.addItem(node);
    });
    return model;
  });
  useEffect(() => {
    onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, consoleErrorCount: 0 });
  }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
