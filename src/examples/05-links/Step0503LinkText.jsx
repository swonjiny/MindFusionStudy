import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0503LinkText({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const order = new ShapeNode(model); order.bounds = new Rect(18, 38, 52, 30); order.text = "주문"; model.addItem(order);
    const payment = new ShapeNode(model); payment.bounds = new Rect(120, 38, 52, 30); payment.text = "결제"; model.addItem(payment);
    const link = model.factory.createDiagramLink(order, payment); link.text = "승인 요청"; link.stroke = "#2877de"; link.strokeThickness = 2;
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 2, linkCount: 1, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
