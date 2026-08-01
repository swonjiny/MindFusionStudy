import { useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

const imageData = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='100' viewBox='0 0 180 100'%3E%3Crect width='180' height='100' rx='12' fill='%23dcecff'/%3E%3Ccircle cx='55' cy='48' r='25' fill='%232768d6'/%3E%3Cpath d='M43 49l9 9 17-21' fill='none' stroke='white' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ctext x='92' y='54' font-family='Arial' font-size='15' fill='%2317355c'%3EHTML IMG%3C/text%3E%3C/svg%3E";

export default function Step0903Image({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram()); const viewRef = useRef(null); const initialized = useRef(false);
  const report = (htmlDomCount = 0) => onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: diagram.nodes.length, linkCount: 0, htmlDomCount, buttonDomCount: 0, consoleErrorCount: 0 });
  const initialize = () => { if (initialized.current) return; const coreView = viewRef.current?.find(); if (!coreView) return; initialized.current = true; const node = new ControlNode(coreView); node.template = `<figure data-mf-html-node="09-03" style="box-sizing:border-box;width:100%;height:100%;margin:0;padding:8px;border:1px solid #9abce9;border-radius:12px;background:white"><img data-testid="control-image" src="${imageData}" alt="HTML 이미지 예제" style="width:100%;height:100%;object-fit:cover;border-radius:8px" /></figure>`; node.bounds = new Rect(45, 24, 165, 92); diagram.addItem(node); };
  const domCreated = (_sender, args) => report(args.node.getContent().querySelectorAll('[data-mf-html-node="09-03"] img').length);
  useEffect(() => () => diagram.clearAll(), [diagram]);
  return <div data-testid="diagram-demo"><p>외부 파일 없이 복사 가능한 data URI 이미지를 표시합니다.</p><div style={{ height: 460 }}><DiagramView ref={viewRef} diagram={diagram} behavior={Behavior.Modify} onControlLoaded={initialize} onNodeDomCreated={domCreated} style={{ width: "100%", height: "100%" }} /></div></div>;
}
