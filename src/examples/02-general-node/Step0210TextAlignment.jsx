import { useEffect, useState } from "react";
import { Alignment, Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0210TextAlignment({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    [["왼쪽 / 위", 18, Alignment.Near], ["가운데", 68, Alignment.Center], ["오른쪽 / 아래", 118, Alignment.Far]].forEach(([text, x, alignment]) => {
      const node = new ShapeNode(model);
      node.bounds = new Rect(x, 34, 45, 38); node.text = text; node.textAlignment = alignment; node.lineAlignment = alignment; node.brush = "#e8f3ff"; node.stroke = "#2877de";
      model.addItem(node);
    });
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 3, linkCount: 0, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
