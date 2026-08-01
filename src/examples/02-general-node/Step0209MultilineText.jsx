import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0209MultilineText({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const node = new ShapeNode(model);
    node.bounds = new Rect(45, 30, 75, 48); node.text = "첫 번째 줄\n두 번째 줄\n세 번째 줄"; node.fontSize = 12; node.brush = "#f4f0ff"; node.stroke = "#7950c7";
    model.addItem(node);
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 1, linkCount: 0, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
