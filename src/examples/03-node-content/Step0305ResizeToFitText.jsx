import { useEffect, useRef, useState } from "react";
import { Behavior, Diagram, FitSize, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0305ResizeToFitText({ onStatus } = {}) {
  const viewRef = useRef(null);
  const [diagram] = useState(() => {
    const model = new Diagram();
    const fixed = new ShapeNode(model);
    fixed.bounds = new Rect(18, 36, 55, 32); fixed.text = "고정 크기"; fixed.brush = "#eef6ff"; fixed.stroke = "#2877de";
    model.addItem(fixed);
    const fitted = new ShapeNode(model);
    fitted.bounds = new Rect(96, 36, 42, 32); fitted.text = "텍스트 길이에 맞춘 노드"; fitted.brush = "#f4f0ff"; fitted.stroke = "#7950c7";
    model.addItem(fitted);
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 2, linkCount: 0, consoleErrorCount: 0 }); }, [diagram]);
  const fitText = () => diagram.nodes[1].resizeToFitText(FitSize.KeepHeight);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={fitText} style={{ width: "100%", height: "100%" }} /></div>;
}
