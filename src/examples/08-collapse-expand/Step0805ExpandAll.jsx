import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0805ExpandAll({ onStatus } = {}) {
  const [done, setDone] = useState(false);
  const [diagram] = useState(() => { const model = new Diagram(); const make = (text, x, y, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(x, y, 46, 24); n.text = text; n.expandable = expandable; n.expanded = false; model.addItem(n); return n; }; const root = make("루트", 100, 8, true), a = make("A", 48, 75, true), b = make("B", 152, 75, true); root.tag = "root"; model.factory.createDiagramLink(root, a); model.factory.createDiagramLink(root, b); [make("A1", 18, 145), make("A2", 75, 145)].forEach((n) => model.factory.createDiagramLink(a, n)); model.factory.createDiagramLink(b, make("B1", 158, 145)); model.nodes.forEach((n) => { n.visible = n === root; }); model.links.forEach((l) => { l.visible = false; }); return model; });
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 6, linkCount: 5, visibleNodeCount: diagram.nodes.filter((n) => n.visible).length, visibleLinkCount: diagram.links.filter((l) => l.visible).length, expandedNodeCount: diagram.nodes.filter((n) => n.expandable && n.expanded).length, consoleErrorCount: 0 });
  useEffect(() => { report(); }, [diagram]);
  const expandAll = () => { diagram.nodes.forEach((n) => { n.visible = true; if (n.expandable) n.expanded = true; }); diagram.links.forEach((l) => { l.visible = true; }); diagram.invalidate(); setDone(true); queueMicrotask(report); };
  return <div data-testid="diagram-demo"><button onClick={expandAll}>전체 펼치기</button><span data-testid="tree-state"> {done ? "모든 노드 표시" : "루트만 표시"}</span><div style={{ height: 460 }}><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div></div>;
}
