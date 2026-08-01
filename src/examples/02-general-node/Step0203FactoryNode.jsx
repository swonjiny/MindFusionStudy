import { useEffect, useState } from "react";
import { Behavior, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";

export default function Step0203FactoryNode({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const node = model.factory.createShapeNode(55, 42, 58, 28);
    node.text = "Factory 생성";
    node.brush = "#e8f8ef";
    node.stroke = "#289766";
    return model;
  });
  useEffect(() => {
    onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, consoleErrorCount: 0 });
  }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
