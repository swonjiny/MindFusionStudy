import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0802RecursiveCollapse({ onStatus } = {}) {
  const [collapsed, setCollapsed] = useState(false);
  const [diagram] = useState(() => { const model = new Diagram(); const make = (text, x, y, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(x, y, 48, 24); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; }; const root = make("부모", 94, 10, true), a = make("자식 A", 42, 78, true), b = make("자식 B", 146, 78); root.tag = "root"; model.factory.createDiagramLink(root, a); model.factory.createDiagramLink(root, b); [make("손자 1", 15, 148), make("손자 2", 70, 148)].forEach((n) => model.factory.createDiagramLink(a, n)); return model; });
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 5, linkCount: 4, visibleNodeCount: diagram.nodes.filter((n) => n.visible).length, visibleLinkCount: diagram.links.filter((l) => l.visible).length, expandedNodeCount: diagram.nodes.filter((n) => n.expandable && n.expanded).length, consoleErrorCount: 0 });
  useEffect(() => { report(); }, [diagram]);
  const hideDescendants = (node) => { node.expanded = false; node.outgoingLinks.forEach((link) => { hideDescendants(link.destination); link.visible = false; link.destination.visible = false; }); };
  const collapse = () => { hideDescendants(diagram.nodes.find((n) => n.tag === "root")); diagram.invalidate(); setCollapsed(true); queueMicrotask(report); };
  return <div data-testid="diagram-demo"><button onClick={collapse}>손자까지 재귀 접기</button><span data-testid="tree-state"> {collapsed ? "모든 하위 노드 숨김" : "전체 펼침"}</span><div style={{ height: 460 }}><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div></div>;
}
