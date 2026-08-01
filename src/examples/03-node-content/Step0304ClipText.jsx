import { useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

export default function Step0304ClipText({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    [["잘리는 아주 긴 노드 텍스트 예제입니다", 18, true], ["줄바꿈으로 표시되는 아주 긴 텍스트", 105, false]].forEach(([text, x, clipText]) => {
      const node = new ShapeNode(model);
      node.bounds = new Rect(x, 35, 65, 36); node.text = text; node.clipText = clipText; node.brush = "#fff4dc"; node.stroke = "#d98719";
      model.addItem(node);
    });
    return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 2, linkCount: 0, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo"><DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}
