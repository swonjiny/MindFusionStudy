import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0206NodePosition({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const node = new ShapeNode(model);
    node.bounds = new Rect(38, 34, 55, 28); node.text = "위치 변경"; node.brush = "#e8f3ff"; node.stroke = "#2877de";
    model.addItem(node);
    return model;
  });
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, consoleErrorCount: 0 });
  useEffect(() => { report(); }, [diagram]);
  const move = () => { const node = diagram.nodes[0]; node.bounds = new Rect(node.bounds.x + 15, node.bounds.y + 10, node.bounds.width, node.bounds.height); report(); };
  return <div data-testid="diagram-demo"><button onClick={move}>오른쪽 아래로 이동</button><div style={{ height: 460 }}><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div></div>;
}
