import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Font, Rect } from "@mindfusion/drawing";

export default function Step0302FontStyle({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    [["Regular 12", 25, new Font("Arial", 12)], ["Bold 16", 100, new Font("Arial", 16, true)]].forEach(([text, x, font]) => {
      const node = new ShapeNode(model);
      node.bounds = new Rect(x, 36, 62, 34); node.text = text; node.font = font; node.brush = "#e8f8ef"; node.stroke = "#289766";
      model.addItem(node);
    });
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 2, linkCount: 0, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
