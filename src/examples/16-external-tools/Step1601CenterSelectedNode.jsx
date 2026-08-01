/**
 * ================================================================
 * [초보자용 상세 주석] 16-01 선택 노드 중심 이동
 * ================================================================
 *
 * 이 파일은 15~19단계가 함께 사용하는 통합 예제의 "진입 컴포넌트"입니다.
 * 실제 Diagram 생성, 트리 제어, 검색, 검증 로직은
 * src/features/integrated/IntegratedDiagramExample.jsx에 한 번만 구현되어 있습니다.
 *
 * 왜 이렇게 나누나요?
 * - 메뉴마다 독립된 컴포넌트 파일과 고유 URL을 유지할 수 있습니다.
 * - 이미 학습한 공통 기능을 복사하지 않아 수정 누락과 동작 차이를 막습니다.
 * - variant 값만 바꾸어 이 메뉴에서 보여 줄 기능을 선택합니다.
 *
 * 읽는 순서
 * 1. import 문으로 공통 통합 컴포넌트를 가져옵니다.
 * 2. props는 부모 화면이 전달한 onStatus 같은 값을 그대로 보존합니다.
 * 3. variant="16-01" 값이 현재 학습 단계를 지정합니다.
 * 4. 자세한 구현은 IntegratedDiagramExample.jsx의 같은 variant 분기를 확인합니다.
 *
 * 주의: 이 얇은 파일 하나만 외부 프로젝트로 복사하면 안 됩니다.
 * 웹 화면의 '입력 실행 JSX' 탭은 외부에서도 실행할 수 있도록 공통 구현 전체를
 * 표시하므로, 외부 프로젝트에서는 그 코드를 복사해 사용하세요.
 */
import IntegratedDiagramExample from "../../features/integrated/IntegratedDiagramExample";
export default function Step1601CenterSelectedNode(props) { return <IntegratedDiagramExample {...props} variant="center" />; }

