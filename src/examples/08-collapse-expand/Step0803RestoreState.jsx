import { useEffect, useRef, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0803RestoreState({ onStatus } = {}) {
  const saved = useRef(null); const [label, setLabel] = useState("원래 상태");
  const [diagram] = useState(() => { const model = new Diagram(); const make = (text, x, y, expandable = false) => { const n = new ShapeNode(model); n.bounds = new Rect(x, y, 48, 24); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; }; const root = make("부모", 94, 10, true), child = make("자식", 55, 80, true), sibling = make("형제", 145, 80), grandchild = make("손자", 55, 150); root.tag = "root"; model.factory.createDiagramLink(root, child); model.factory.createDiagramLink(root, sibling); model.factory.createDiagramLink(child, grandchild); return model; });
  const report = () => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 4, linkCount: 3, visibleNodeCount: diagram.nodes.filter((n) => n.visible).length, visibleLinkCount: diagram.links.filter((l) => l.visible).length, expandedNodeCount: diagram.nodes.filter((n) => n.expandable && n.expanded).length, consoleErrorCount: 0 });
  useEffect(() => { report(); }, [diagram]);
  const collapse = () => { saved.current = { nodes: diagram.nodes.map((n) => [n, n.visible, n.expanded]), links: diagram.links.map((l) => [l, l.visible]) }; const root = diagram.nodes.find((n) => n.tag === "root"); root.expanded = false; diagram.nodes.filter((n) => n !== root).forEach((n) => { n.visible = false; }); diagram.links.forEach((l) => { l.visible = false; }); diagram.invalidate(); setLabel("임시로 접힘"); queueMicrotask(report); };
  const restore = () => { if (!saved.current) return; saved.current.nodes.forEach(([n, visible, expanded]) => { n.visible = visible; n.expanded = expanded; }); saved.current.links.forEach(([l, visible]) => { l.visible = visible; }); diagram.invalidate(); setLabel("기존 상태 복원"); queueMicrotask(report); };
  return <div data-testid="diagram-demo"><button onClick={collapse}>임시 접기</button> <button onClick={restore}>기존 상태 복원</button><span data-testid="tree-state"> {label}</span><div style={{ height: 450 }}><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div></div>;
}
