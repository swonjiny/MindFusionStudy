import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0205CreationComparison({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const factoryNode = model.factory.createShapeNode(24, 42, 55, 28);
    factoryNode.text = "Factory 생성"; factoryNode.brush = "#e8f8ef"; factoryNode.stroke = "#289766";
    const directNode = new ShapeNode(model);
    directNode.bounds = new Rect(92, 42, 55, 28);
    directNode.text = "직접 생성"; directNode.brush = "#fff3df"; directNode.stroke = "#d98719";
    model.addItem(directNode);
    return model;
  });
  useEffect(() => {
    onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, consoleErrorCount: 0 });
  }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
