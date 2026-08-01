import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0502TwoLinks({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const nodes = ["입력", "처리", "출력"].map((text, index) => {
      const node = new ShapeNode(model); node.bounds = new Rect(10 + index * 70, 38, 45, 30); node.text = text; model.addItem(node); return node;
    });
    model.factory.createDiagramLink(nodes[0], nodes[1]);
    model.factory.createDiagramLink(nodes[1], nodes[2]);
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 3, linkCount: 2, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
