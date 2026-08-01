import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0303TextStroke({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const plain = new ShapeNode(model);
    plain.bounds = new Rect(22, 36, 62, 34); plain.text = "기본 텍스트"; plain.fontSize = 14; plain.brush = "#eef6ff"; plain.stroke = "#2877de";
    model.addItem(plain);
    const outlined = new ShapeNode(model);
    outlined.bounds = new Rect(100, 36, 62, 34); outlined.text = "외곽선 텍스트"; outlined.fontSize = 14;
    outlined.textColor = "#ffffff"; outlined.textStroke = "#274c77"; outlined.textStrokeThickness = 1; outlined.brush = "#8fb8de"; outlined.stroke = "#274c77";
    model.addItem(outlined);
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 2, linkCount: 0, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
