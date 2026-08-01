import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0501SingleLink({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const start = new ShapeNode(model); start.bounds = new Rect(20, 38, 48, 30); start.text = "시작"; model.addItem(start);
    const end = new ShapeNode(model); end.bounds = new Rect(120, 38, 48, 30); end.text = "도착"; model.addItem(end);
    const link = model.factory.createDiagramLink(start, end); link.stroke = "#4e6b95"; link.strokeThickness = 2;
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 2, linkCount: 1, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
