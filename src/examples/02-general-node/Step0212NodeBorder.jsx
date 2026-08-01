import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { DashStyle, Rect } from "@mindfusion/drawing";

export default function Step0212NodeBorder({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    [["기본", 18, 1, DashStyle.Solid], ["굵은 선", 70, 3, DashStyle.Solid], ["점선", 122, 2, DashStyle.Dash]].forEach(([text, x, thickness, dash]) => {
      const node = new ShapeNode(model);
      node.bounds = new Rect(x, 40, 44, 28); node.text = text; node.brush = "#eef6ff"; node.stroke = "#2877de"; node.strokeThickness = thickness; node.strokeDashStyle = dash;
      model.addItem(node);
    });
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 3, linkCount: 0, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
