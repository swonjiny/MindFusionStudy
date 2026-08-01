import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0207NodeSize({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const node = new ShapeNode(model);
    node.bounds = new Rect(50, 40, 55, 28); node.text = "크기 변경"; node.brush = "#e8f3ff"; node.stroke = "#2877de";
    model.addItem(node);
    return model;
  });
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, consoleErrorCount: 0 });
  useEffect(() => { report(); }, [diagram]);
  const resize = () => { const node = diagram.nodes[0]; node.bounds = new Rect(node.bounds.x, node.bounds.y, node.bounds.width + 12, node.bounds.height + 8); report(); };
  return <div data-testid="diagram-demo"><button onClick={resize}>노드 크게 만들기</button><div style={{ height: 460 }}><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div></div>;
}
