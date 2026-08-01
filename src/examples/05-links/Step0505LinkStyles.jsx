import { useEffect, useState } from "react";
import { ArrowHeads, Behavior, Diagram, LinkShape, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { DashStyle, Rect } from "@mindfusion/drawing";

export default function Step0505LinkStyles({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    const nodes = [["시작", 12, 28], ["분기", 80, 55], ["완료", 148, 28]].map(([text, x, y]) => {
      const node = new ShapeNode(model); node.bounds = new Rect(x, y, 45, 28); node.text = text; model.addItem(node); return node;
    });
    const curve = model.factory.createDiagramLink(nodes[0], nodes[1]); curve.text = "Bezier"; curve.shape = LinkShape.Bezier; curve.stroke = "#2877de";
    const cascade = model.factory.createDiagramLink(nodes[1], nodes[2]); cascade.text = "Cascading"; cascade.shape = LinkShape.Cascading; cascade.stroke = "#d97706"; cascade.strokeDashStyle = DashStyle.Dash; cascade.headShape = ArrowHeads.Triangle();
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 3, linkCount: 2, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
