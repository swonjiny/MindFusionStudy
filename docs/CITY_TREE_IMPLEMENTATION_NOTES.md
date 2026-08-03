# 도시 정보 트리 구현 조사 기록

## 조사 결과

기존 프로젝트는 `@mindfusion/diagramming` 4.9.1의 `ControlNode`를 HTML 노드에 사용한다. React `DiagramView`의 `onControlLoaded`에서 `ref.current.find()`로 core view를 얻고, `new ControlNode(coreView)`로 생성한 뒤 `diagram.addItem(node)`으로 등록하는 방식이 브라우저와 Playwright에서 이미 검증되어 있었다.

메뉴는 `src/data/lessonMenus.js`, 실행 컴포넌트는 `src/data/lessonRegistry.js`, Markdown은 `import.meta.glob(..., { query: "?raw" })`, 소스 뷰어는 raw import와 파일 매핑으로 연결된다. 실행 컴포넌트가 `onStatus`를 호출하면 `App`을 거쳐 우측 `VerificationPanel`이 계산 결과를 표시한다.

## 사용한 HTML 노드 렌더링 방식

- `ControlNode.template`에 `renderCityTreeNode`가 만든 HTML 문자열을 지정한다.
- `nodeDomCreated` 이후 `node.getContent()`로 실제 DOM을 얻는다.
- `data-interactive="true"` 버튼은 이벤트 위임으로 처리하고 `stopPropagation()`으로 노드 선택과 분리한다.
- 노드 선택, 접기·펼치기, 상세 확장 상태는 React state와 ref를 함께 사용해 DOM 이벤트에서도 최신 값을 읽는다.

## 선택 이유

ControlNode는 현재 저장소의 09~15단계에서 실제 성공한 방식이다. 별도 React Portal이나 외부 DOM overlay로 교체하면 기존 검증 경로와 확대·축소 동기화가 달라지므로 사용하지 않았다.

## 노드 위치 동기화 방식

노드 좌표는 `basePositions`에 저장하고 `node.bounds = new Rect(...)`로 적용한다. ControlNode HTML은 Diagram 좌표 변환을 그대로 받으므로 드래그, 스크롤, 확대·축소 시 별도 화면 좌표 계산이 필요하지 않다.

## 외부 아이콘 배치 방식

아이콘은 ControlNode의 DOM 안에 포함하지만 실제 카드 요소의 테두리 아래에 absolute positioning한다. content의 `overflow`를 `visible`로 설정해 카드 밖으로 보이도록 했다. 따라서 아이콘은 노드와 같은 변환을 받고 이동·확대·축소 관계가 유지된다.

## 확장 노드 크기 변경 방식

해운대구의 `detailExpandedId`가 활성화되면 template을 상세 카드가 포함된 버전으로 교체하고 bounds를 135×110으로 변경한다. 우측 형제와 자식 노드의 bounds도 이동시켜 겹침을 줄인다. 원래대로 가기에서는 기본 bounds와 template을 복원한다.

## 연결선 갱신 방식

부모·자식 ID로 16개의 `DiagramLink`를 한 번 생성한다. 노드 bounds나 visibility를 바꾼 뒤 `diagram.invalidate()`를 호출한다. 접힌 조상의 하위 노드와 연결선은 함께 `visible = false`가 된다.

## 알려진 제한사항

- 단계별 화면은 학습 흐름을 위해 기능을 누적 공개하지만 18개 도시 데이터와 16개 연결선은 모든 단계가 공유한다.
- 대표 이미지는 네트워크 의존성을 없애기 위해 데이터 URI 기반 벡터 도시 썸네일을 사용한다.
- 작은 화면에서는 우측 상세 패널이 하단으로 이동하며, 전체 트리 탐색에는 화면 맞춤 도구 사용이 권장된다.

## 브라우저 검증 결과

2026-08-03 실제 브라우저에서 다음을 확인했다.

- 전체 화면에서 화면 맞춤 60%로 렌더링했으며 ControlNode 카드와 DiagramLink가 같은 좌표에 정렬되었다.
- `ControlNode.createBackgroundImage = false`로 메인 뷰의 중복 배경 SVG를 만들지 않았고, MindFusion 내부 canvas에는 강제 CSS 크기를 적용하지 않았다.
- 서울·부산 루트 2개, 전체 노드 18개, 연결선 16개, 외부 아이콘 72개, 해운대 상세 카드 3개가 모두 표시되었다.
- 전체 닫기 2개 표시, 전체 열기 18개 표시, 부산 루트 닫기 9개 표시, 부산 루트 열기 18개 표시로 상태가 갱신되었다.
- 해운대구 상세 복원 시 카드 0개·확장 false, 재확장 시 카드 3개·확장 true로 변경되었다.
- 선택 상세 패널과 특징정보가 표시되고 실행 확인 23/23, 브라우저 콘솔 오류 0개를 확인했다.
