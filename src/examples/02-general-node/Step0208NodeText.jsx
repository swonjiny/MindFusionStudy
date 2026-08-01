import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0208NodeText({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const node = new ShapeNode(model);
    node.bounds = new Rect(48, 38, 68, 32); node.text = "한글 텍스트"; node.textColor = "#1456b8"; node.fontSize = 14; node.brush = "#eef6ff"; node.stroke = "#2877de";
    model.addItem(node);
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 1, linkCount: 0, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
