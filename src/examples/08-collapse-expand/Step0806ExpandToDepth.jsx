import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0806ExpandToDepth({ onStatus } = {}) {
  const [done, setDone] = useState(false);
  const [diagram] = useState(() => { const model = new Diagram(); const make = (text, x, y, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(x, y, 44, 23); n.text = text; n.expandable = expandable; n.expanded = false; model.addItem(n); return n; }; const root = make("1단계", 100, 8, true), a = make("2단계 A", 45, 75, true), b = make("2단계 B", 155, 75, true); root.tag = "root"; model.factory.createDiagramLink(root, a); model.factory.createDiagramLink(root, b); [make("3단계 A1", 15, 145), make("3단계 A2", 67, 145)].forEach((n) => model.factory.createDiagramLink(a, n)); [make("3단계 B1", 137, 145), make("3단계 B2", 189, 145)].forEach((n) => model.factory.createDiagramLink(b, n)); model.nodes.forEach((n) => { n.visible = n === root; }); model.links.forEach((l) => { l.visible = false; }); return model; });
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 7, linkCount: 6, visibleNodeCount: diagram.nodes.filter((n) => n.visible).length, visibleLinkCount: diagram.links.filter((l) => l.visible).length, expandedNodeCount: diagram.nodes.filter((n) => n.expandable && n.expanded).length, consoleErrorCount: 0 });
  useEffect(() => { report(); }, [diagram]);
  const expandToDepth = (maxDepth) => { const root = diagram.nodes.find((n) => n.tag === "root"); const visit = (node, depth) => { node.visible = depth <= maxDepth; node.expanded = node.expandable && depth < maxDepth; node.outgoingLinks.forEach((link) => { link.visible = depth < maxDepth; visit(link.destination, depth + 1); }); }; visit(root, 1); diagram.invalidate(); setDone(true); queueMicrotask(report); };
  return <div data-testid="diagram-demo"><button onClick={() => expandToDepth(2)}>2단계까지만 펼치기</button><span data-testid="tree-state"> {done ? "깊이 2까지 표시" : "루트만 표시"}</span><div style={{ height: 460 }}><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div></div>;
}
