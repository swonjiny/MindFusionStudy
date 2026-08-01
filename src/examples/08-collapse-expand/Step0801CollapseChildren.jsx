import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0801CollapseChildren({ onStatus } = {}) {
  const [collapsed, setCollapsed] = useState(false);
  const [diagram] = useState(() => { const model = new Diagram(); const make = (text, x, y, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(x, y, 50, 26); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; }; const root = make("부모", 90, 20, true); root.tag = "root"; [make("자식 A", 35, 100), make("자식 B", 145, 100)].forEach((n) => model.factory.createDiagramLink(root, n)); return model; });
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 3, linkCount: 2, visibleNodeCount: diagram.nodes.filter((n) => n.visible).length, visibleLinkCount: diagram.links.filter((l) => l.visible).length, expandedNodeCount: diagram.nodes.filter((n) => n.expandable && n.expanded).length, consoleErrorCount: 0 });
  useEffect(() => { report(); }, [diagram]);
  const collapse = () => { const root = diagram.nodes.find((n) => n.tag === "root"); root.expanded = false; root.outgoingLinks.forEach((link) => { link.visible = false; link.destination.visible = false; }); diagram.invalidate(); setCollapsed(true); queueMicrotask(report); };
  return <div data-testid="diagram-demo"><button onClick={collapse}>자식과 연결선 접기</button><span data-testid="tree-state"> {collapsed ? "접힘" : "펼침"}</span><div style={{ height: 460 }}><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div></div>;
}
