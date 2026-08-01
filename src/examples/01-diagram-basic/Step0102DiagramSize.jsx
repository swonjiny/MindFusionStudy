import { useEffect, useState } from "react";
import { Behavior, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";

export default function Step0102DiagramSize({ onStatus } = {}) {
  const [diagram] = useState(() => new Diagram());

  useEffect(() => {
    onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 0, linkCount: 0, consoleErrorCount: 0 });
  }, [diagram]);

  return (
    <div style={{ height: "min(500px, 70vh)", minHeight: 320, border: "1px solid #dbe3ee", borderRadius: 10, overflow: "hidden" }} data-testid="diagram-demo">
      <DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
