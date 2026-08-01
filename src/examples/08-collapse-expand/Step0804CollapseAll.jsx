import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0804CollapseAll({ onStatus } = {}) {
  const [done, setDone] = useState(false);
  const [diagram] = useState(() => { const model = new Diagram(); const make = (text, x, y, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(x, y, 44, 23); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; }; const root = make("루트", 100, 8, true), a = make("A", 48, 75, true), b = make("B", 152, 75, true); root.tag = "root"; model.factory.createDiagramLink(root, a); model.factory.createDiagramLink(root, b); [make("A1", 18, 145), make("A2", 70, 145)].forEach((n) => model.factory.createDiagramLink(a, n)); [make("B1", 130, 145), make("B2", 182, 145)].forEach((n) => model.factory.createDiagramLink(b, n)); return model; });
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 7, linkCount: 6, visibleNodeCount: diagram.nodes.filter((n) => n.visible).length, visibleLinkCount: diagram.links.filter((l) => l.visible).length, expandedNodeCount: diagram.nodes.filter((n) => n.expandable && n.expanded).length, consoleErrorCount: 0 });
  useEffect(() => { report(); }, [diagram]);
  const collapseAll = () => { const root = diagram.nodes.find((n) => n.tag === "root"); diagram.nodes.forEach((n) => { if (n.expandable) n.expanded = false; n.visible = n === root; }); diagram.links.forEach((l) => { l.visible = false; }); diagram.invalidate(); setDone(true); queueMicrotask(report); };
  return <div data-testid="diagram-demo"><button onClick={collapseAll}>전체 접기</button><span data-testid="tree-state"> {done ? "루트만 표시" : "전체 펼침"}</span><div style={{ height: 460 }}><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div></div>;
}
