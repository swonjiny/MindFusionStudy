# 19-16 도시 정보 트리 예제 개요

## 1. 학습 목표

도시 정보 트리 예제 개요 단계의 목적과 ControlNode 기반 구현 흐름을 이해한다. 데이터 수와 실제 Diagram 모델·DOM 수가 일치하는지도 확인한다.

## 2. 완성 화면

실행 화면은 단계 안내, 중앙 MindFusion Diagram, 단계에 따라 좌우 제어·상세 패널로 구성된다. 중앙에는 서울·부산 루트, 구·동 노드, 16개의 연결선이 표시된다.

## 3. 이전 단계에서 추가된 기능

전체 구성과 검증 지표를 소개한다. 공통 기능은 `CityTreeCanvas`에 유지하고 이 메뉴는 `variant="overview"`만 선택한다.

## 4. 데이터 구조

`cityTreeRoots`를 재귀 순회해 `cityTreeNodes`를 만든다. 각 항목은 `id`, `parentId`, `rootId`, `depth`, `categoryIcons`, `detail`, `children`을 가진다. 전체 수는 루트 2개, 노드 18개, 연결선 16개다.

## 5. HTML 노드 렌더링 방식

`new ControlNode(coreView)`로 노드를 만들고 `node.template`에 `renderCityTreeNode`가 생성한 HTML 문자열을 넣는다. 실제 DOM 생성 뒤 `getContent()`와 `nodeDomCreated`로 클릭 이벤트를 연결한다.

## 6. 파일 구성

- `CityTreeCanvas.jsx`: Diagram 모델과 상태 관리
- `CityTreeNode.jsx`: HTML 템플릿
- `CityTreeExternalIcons.jsx`: 아이콘과 범례
- `CityTreeDetailCards.jsx`: 상세 카드 3개
- `CityTreeControlPanel.jsx`: Ant Design 제어 패널
- `CityTreeDetailPanel.jsx`: 우측 상세 패널
- `cityTreeSampleData.js`: 도시 데이터

## 7. 구현 순서

1. `DiagramView`가 준비된 뒤 core view를 얻는다.
2. 18개의 ControlNode와 16개의 DiagramLink를 만든다.
3. DOM 이벤트를 중복 없이 등록한다.
4. variant에 맞는 버튼·아이콘·패널을 표시한다.
5. 모델과 DOM을 다시 계산해 `onStatus`로 보고한다.

## 8. 전체 소스 코드

이 메뉴의 독립 진입 파일 전체 코드는 아래와 같다. 공통 전체 구현은 같은 화면의 **소스 코드** 탭에서 `CityTreeCanvas.jsx` 원문으로 제공된다.

```jsx
/** [초보자용 상세 주석] 도시 정보 트리 예제 개요 단계의 독립 실행 진입점입니다. */
import CityTreeCanvas from "../../components/city-tree/CityTreeCanvas";
export default function Step1916CityTreeOverview(props) {
  return <CityTreeCanvas {...props} variant="overview" />;
}
```

## 9. 소스 상세 설명

wrapper는 학습 메뉴와 공통 엔진을 분리한다. 단계 파일은 독립 등록되지만 ControlNode 생성, 이벤트 정리, 상태 계산 코드는 복제되지 않는다.

## 10. 노드 위치와 연결선 처리

`basePositions`가 기본 좌표를 보관한다. 상세 확장 때 `positionFor`가 해운대구의 폭·높이를 늘리고 형제·자식 위치를 이동한다. `node.bounds` 변경 뒤 `diagram.invalidate()`로 연결선을 갱신한다.

## 11. 외부 아이콘 배치 방식

아이콘은 ControlNode DOM 안에서 `position:absolute`로 카드 테두리 아래에 놓인다. content의 `overflow`를 `visible`로 설정하므로 잘리지 않고 노드 이동·확대·축소를 그대로 따른다.

## 12. 접기·펼치기 상태 관리

`collapsedIds` Set이 접힌 부모 ID를 보관한다. `hasCollapsedAncestor`가 조상을 검사해 노드 visibility를 정하고, 연결선은 양 끝 노드가 모두 보일 때만 표시한다.

## 13. 상세 확장 상태 관리

`detailExpandedId`는 상세 노드 하나를 가리킨다. 해운대구 확장 시 템플릿에 카드 3개를 추가하고 bounds를 바꾼다. **원래대로 가기**는 기본 템플릿과 크기를 복원한다.

## 14. 우측 패널 상태 연동

노드 카드나 상세 버튼을 누르면 `selectedId`가 갱신된다. 우측 패널은 같은 데이터에서 이미지, 상위 노드, 유형, 면적, 인구, 행정구역, 기준일, 지표와 기관을 읽는다.

## 15. 자동 검증

검증 값은 `diagram.nodes`, `diagram.links`, visible 상태, 실제 `data-city-node-id` DOM, categoryIcons와 detailCards 배열에서 계산한다. 하드코딩한 성공값을 보내지 않는다.

## 16. 수동 확인

두 루트와 연결선을 확인한 뒤 제공되는 단계에서 노드 선택, 접기·펼치기, 상세 확장·복원, 특징정보 닫기·재표시, 루트별 제어, 우측 패널 변경을 실행한다.

## 17. 자주 발생하는 오류

ControlNode를 core view 준비 전에 만들면 빈 박스가 보일 수 있다. 버튼에 `data-interactive="true"`가 없거나 이벤트 전파를 막지 않으면 버튼 클릭이 노드 선택과 충돌한다.

## 18. 오류 해결

`onControlLoaded`에서 `viewRef.current.find()`를 확인한 뒤 노드를 만든다. DOM은 `nodeDomCreated` 이후 조회한다. 상태 변경 뒤 template, bounds, visibility를 갱신하고 `diagram.invalidate()`를 호출한다.

## 19. 다음 단계

다음 메뉴에서 도시 정보 트리 기본 구조 기능을 추가한다.

## 20. 핵심 요약

검증된 ControlNode HTML 방식과 공통 상태 엔진을 재사용한다. 데이터·모델·DOM·패널을 같은 ID로 연결해 상호작용과 자동 검증 값이 어긋나지 않게 유지한다.

