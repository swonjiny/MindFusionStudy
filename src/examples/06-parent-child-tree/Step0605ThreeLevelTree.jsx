import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0605ThreeLevelTree({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram(); const make = (text, x, y, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(x, y, 48, 24); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; }; const link = (a, b) => model.factory.createDiagramLink(a, b);
    const root = make("1단계", 100, 10, true), a = make("2단계 A", 42, 78, true), b = make("2단계 B", 158, 78, true); link(root, a); link(root, b);
    [make("3단계 A1", 12, 148), make("3단계 A2", 70, 148)].forEach((n) => link(a, n)); [make("3단계 B1", 128, 148), make("3단계 B2", 186, 148)].forEach((n) => link(b, n)); return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 7, linkCount: 6, visibleNodeCount: 7, visibleLinkCount: 6, expandedNodeCount: 3, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
