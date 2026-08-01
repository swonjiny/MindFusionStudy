import { useEffect, useState } from "react";
import { Alignment, Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect, Thickness } from "@mindfusion/drawing";

export default function Step0301TextPadding({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    [["기본 여백", 22, new Thickness(2)], ["넓은 여백", 100, new Thickness(10, 8, 10, 8)]].forEach(([text, x, padding]) => {
      const node = new ShapeNode(model);
      node.bounds = new Rect(x, 35, 60, 38); node.text = text; node.textPadding = padding;
      node.textAlignment = Alignment.Near; node.lineAlignment = Alignment.Near; node.brush = "#eef6ff"; node.stroke = "#2877de";
      model.addItem(node);
    });
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 2, linkCount: 0, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
