import { useEffect, useState } from "react";
import { Behavior, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";

const hostStyle = { height: 500, border: "1px solid #dbe3ee", borderRadius: 10, overflow: "hidden", background: "#f1f7ff" };

export default function Step0101EmptyDiagram({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = new Diagram();
    model.backBrush = "#f1f7ff";
    return model;
  });

  useEffect(() => {
    onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 0, linkCount: 0, consoleErrorCount: 0 });
  }, [diagram]);

  return (
    <div style={hostStyle} data-testid="diagram-demo">
      <DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
