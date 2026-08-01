/**
 * ================================================================
 * [초보자용 상세 주석] 07-02 트리 간격 조정
 * ================================================================
 *
 * 이 파일에서 만드는 것
 * - 레벨 간격과 같은 레벨의 노드 간격을 조정합니다.
 * - 예상 결과: 노드 6개, 연결선 5개
 * - 이 JSX 파일은 프로젝트 내부 상대경로에 의존하지 않으므로 다른 React 프로젝트로 복사할 수 있습니다.
 *
 * 코드를 읽는 권장 순서
 * 1. import: React와 MindFusion에서 어떤 도구를 가져오는지 확인합니다.
 * 2. 상수·데이터: 노드에 넣을 값과 반복할 배열을 확인합니다.
 * 3. 컴포넌트 상태·ref: 화면이 기억할 값과 MindFusion 인스턴스를 확인합니다.
 * 4. 초기화 함수: Diagram, 노드와 연결선을 어떤 순서로 만드는지 확인합니다.
 * 5. 이벤트 함수: 클릭·선택·DOM 생성 뒤 어떤 상태가 바뀌는지 확인합니다.
 * 6. cleanup: 컴포넌트가 사라질 때 이벤트와 모델을 어떻게 정리하는지 확인합니다.
 * 7. return JSX: DiagramView에 model, ref와 이벤트 prop이 어떻게 전달되는지 확인합니다.
 *
 * 이번 예제의 핵심 용어
 * - levelDistance: 이번 예제에서 levelDistance 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 * - nodeDistance: 이번 예제에서 nodeDistance 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 *
 * 기억할 점
 * - Diagram은 데이터 모델이고 DiagramView는 그 모델을 화면에 표시하는 React 뷰입니다.
 * - Rect의 네 값은 순서대로 x, y, width, height입니다.
 * - onStatus는 학습 사이트의 검증 패널용 선택적 prop입니다. 외부 프로젝트에서는 전달하지 않아도 됩니다.
 * - StrictMode의 개발 환경 이중 마운트가 문제가 되면 안내된 main.jsx처럼 StrictMode 없이 먼저 확인하세요.
 * - 레이아웃은 노드와 연결선이 모두 생성된 다음 실행해야 전체 구조를 올바르게 계산합니다.
 */
import { /* [React 생명주기] effect는 렌더링 뒤 부수 작업을 수행하고, 반환 함수는 unmount 시 리스너와 Diagram 내용을 정리합니다. */
useEffect, useState } from "react";
import { Behavior, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";
import { LayoutDirection, TreeLayout } from "@mindfusion/graphs";

/* [컴포넌트 시작] 이 함수가 외부에서 import해 렌더링하는 예제 컴포넌트입니다. props의 onStatus는 선택 사항입니다. */
export default function Step0702LayoutSpacing({ onStatus } = {}) {
  const [diagram] = useState(() => {
    const model = /* [Diagram 생성] 노드와 연결선을 보관할 모델을 만듭니다. useState의 초기 함수 안에서 만들면 React 재렌더링에도 같은 모델을 유지합니다. */
new Diagram(); const make = (text, expandable = false) => { const n = /* [일반 노드 생성] ShapeNode 객체만 만든 상태이며, bounds·text·스타일을 설정한 뒤 Diagram에 등록해야 화면에 나타납니다. */
new ShapeNode(model); n.bounds = /* [위치와 크기] Rect(x, y, width, height)로 다이어그램 좌표상의 위치와 노드 크기를 함께 지정합니다. */
new Rect(0, 0, 46, 24); n.text = text; n.expandable = expandable; n.expanded = expandable; model.addItem(n); return n; };
    const root = make("넓은 간격", true); for (let i = 1; i <= 5; i += 1) model.factory./* [연결선 생성] 출발 노드와 도착 노드가 Diagram에 준비된 뒤 두 노드를 연결합니다. */
createDiagramLink(root, make(`자식 ${i}`)); const layout = new TreeLayout(); layout.direction = LayoutDirection.TopToBottom; layout.levelDistance = 42; layout.nodeDistance = 26; model.arrange(layout); return model;
  });
  useEffect(() => { onStatus?.({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 6, linkCount: 5, visibleNodeCount: 6, visibleLinkCount: 5, expandedNodeCount: 1, consoleErrorCount: 0 }); }, [diagram]);
  return <div style={{ height: 500 }} data-testid="diagram-demo">/* [화면 렌더링] 준비한 Diagram 모델과 ref, 이벤트 함수를 DiagramView prop으로 전달합니다. 부모 요소에는 반드시 높이가 있어야 합니다. */
<DiagramView diagram={diagram} behavior={Behavior.Modify} style={{ width: "100%", height: "100%" }} /></div>;
}

