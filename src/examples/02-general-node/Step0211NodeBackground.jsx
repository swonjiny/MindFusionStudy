import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0211NodeBackground({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    ["기본", "성공", "주의"].forEach((text, index) => {
      const node = new ShapeNode(model);
      node.bounds = new Rect(18 + index * 52, 40, 44, 28); node.text = text;
      node.brush = ["#e8f3ff", "#e8f8ef", "#fff4dc"][index]; node.stroke = ["#2877de", "#289766", "#d98719"][index];
      model.addItem(node);
    });
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 3, linkCount: 0, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
