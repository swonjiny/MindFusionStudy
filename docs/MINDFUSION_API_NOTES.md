# MindFusion API 조사 노트

조사일: 2026-07-30

이 문서는 구현보다 먼저 작성한 1차 조사 결과다. 빈 저장소에서 시작했으므로 패키지 버전을 npm 레지스트리에서 확인해 고정 설치한 뒤, 설치된 패키지의 메타데이터, 선언 파일, ESM 배포 파일과 MindFusion 공식 문서를 대조했다.

## 1. 조사한 프로젝트 상태

- 최초 작업 폴더에는 프로젝트 파일과 `package.json`이 없었고 Git 저장소도 아니었다.
- React + Vite 프로젝트 기반을 새로 구성해야 했다.
- TypeScript는 사용하지 않으며 React 컴포넌트는 `.jsx`, 나머지는 `.js`로 작성한다.
- 현재 고정한 핵심 런타임은 Node.js 24.14.0, React 19.2.8, Vite 8.2.0이다.

## 2. 설치된 패키지 버전

| 패키지 | 버전 |
| --- | --- |
| `@mindfusion/diagramming` | 4.9.1 |
| `@mindfusion/diagramming-react` | 4.9.0 |
| `@mindfusion/drawing` | 4.4.0 |
| `react` / `react-dom` | 19.2.8 |
| `antd` | 6.5.2 |
| `@ant-design/icons` | 6.3.2 |
| `react-markdown` | 10.1.0 |
| `remark-gfm` | 4.0.1 |
| `vite` | 8.2.0 |
| `@playwright/test` | 1.62.0 |

`@mindfusion/diagramming-react` 4.9.0의 실제 `peerDependencies`는 React와 React DOM `^19.0.0`이다.

## 3. 확인된 export

설치된 ESM 배포 파일과 선언 파일에서 다음 export를 확인했다.

- `@mindfusion/diagramming`: `Diagram`, `ShapeNode`, `Factory`, `Alignment`, `Behavior`, `AutoResize`, `Events` 등
- `@mindfusion/diagramming-react`: `DiagramView`, `Overview`, `NodeListView`, `ZoomControl`, `Ruler`, `TabbedDiagramView` 등
- `@mindfusion/drawing`: `Rect`, `Point`, `Size`, `DashStyle`, `Font` 등

이번 범위에서는 `Diagram`, `ShapeNode`, `Alignment`, `DiagramView`, `Rect`, `DashStyle`만 사용한다.

## 4. Diagram과 DiagramView

확인된 생성 방식은 다음과 같다.

```js
const diagram = new Diagramming.Diagram();
```

React 래퍼의 `DiagramView`는 `diagram` prop으로 모델을 받는다.

```jsx
<DiagramView diagram={diagram} />
```

설치된 래퍼 소스는 내부에서 canvas에 core `DiagramView`를 연결하며 기본 스타일로 `width: "100%"`, `height: "100%"`, `overflow: "auto"`를 사용한다. 따라서 부모 요소에 실제 높이가 반드시 있어야 한다.

래퍼는 `ref`를 지원하며 `ref.current.find()`로 내부 core `DiagramView`를 얻을 수 있다. `zoomFactor`는 래퍼 prop으로 전달할 수 있다.

## 5. Factory 사용법

`Diagram.factory`가 Factory 인스턴스를 제공한다. `createShapeNode`는 `Rect` 하나 또는 숫자 네 개를 받을 수 있다.

```js
const node = diagram.factory.createShapeNode(20, 20, 40, 24);
```

설치된 선언 파일의 설명과 공식 API 문서 모두 이 메서드가 다음 두 작업을 함께 수행한다고 명시한다.

1. `ShapeNode` 인스턴스 생성
2. 해당 Diagram의 nodes 컬렉션에 등록

따라서 반환된 노드를 다시 `diagram.addItem(node)`로 추가하지 않는다. 중복 등록을 피하기 위해 Factory 예제에서는 `addItem`을 호출하지 않는다.

## 6. 직접 생성 방식

설치된 `ShapeNode`는 부모 Diagram을 선택 인자로 받는 `DiagramNode` 생성자를 상속한다.

```js
const node = new Diagramming.ShapeNode(diagram);
node.bounds = new Drawing.Rect(20, 20, 40, 24);
node.text = "직접 생성";
diagram.addItem(node);
```

생성자에 Diagram을 전달하면 Diagram의 기본 노드 속성을 복사하지만, 화면에 자동 등록되지는 않는다. 직접 생성한 뒤 `diagram.addItem(node)`를 호출해야 한다.

## 7. 노드 속성과 스타일

설치된 선언 파일에서 다음 실제 속성을 확인했다.

- 위치와 크기: `node.bounds = new Rect(x, y, width, height)`
- 텍스트: `node.text`
- 채우기: `node.brush`
- 테두리 색: `node.stroke` 또는 이전 별칭인 `node.pen`
- 테두리 두께: `node.strokeThickness`
- 테두리 선 모양: `node.strokeDashStyle`
- 글자색: `node.textColor`
- 글자 크기: `node.fontSize`
- 가로 정렬: `node.textAlignment`
- 세로 정렬: `node.lineAlignment`

텍스트 정렬에는 `@mindfusion/diagramming`의 `Alignment.Near`, `Alignment.Center`, `Alignment.Far`를 사용한다. 테두리 선 모양에는 `@mindfusion/drawing`의 `DashStyle`을 사용한다.

## 8. 노드와 연결선 수 확인

현재 버전의 `Diagram`은 배열을 반환하는 읽기 전용 getter를 제공한다.

```js
const nodeCount = diagram.nodes.length;
const linkCount = diagram.links.length;
```

이번 범위의 모든 예제는 연결선을 생성하지 않으므로 `linkCount`는 0이어야 한다.

## 9. 초기화, 다시 실행, 정리

`diagram.clearAll()`은 Diagram의 모든 item을 제거한다. 각 예제는 독립 `Diagram` 인스턴스를 만들고, 초기화 함수 시작 시 `clearAll()`을 호출한 다음 현재 단계의 항목만 다시 만든다.

다시 실행은 상위에서 `resetToken`을 증가시켜 예제 초기화 effect를 다시 실행하는 방식으로 구현한다. 예제 변경 시에는 React `key`도 바뀌므로 예제 인스턴스가 분리된다.

React 래퍼의 실제 ESM 소스는 unmount cleanup에서 내부 core control의 `dispose()`를 호출한다. 애플리케이션 코드는 래퍼가 소유한 core view를 별도로 dispose하지 않는다. 예제 cleanup에서는 모델의 `clearAll()`만 호출한다.

## 10. React StrictMode

개발 모드의 StrictMode는 초기화 함수와 effect를 재호출할 수 있다. 중복 노드를 방지하기 위해 다음 규칙을 확인했다.

1. 각 예제의 초기화가 시작될 때 `diagram.clearAll()`을 호출한다.
2. effect cleanup에서도 `diagram.clearAll()`을 호출한다.
3. Factory 생성 노드를 `addItem`으로 다시 추가하지 않는다.
4. 상위 재실행은 `resetToken`으로 명시적으로 수행한다.

단순 `initializedRef`만 사용하면 StrictMode의 cleanup 이후 두 번째 setup에서 빈 Diagram이 남을 수 있으므로 사용하지 않는다.

브라우저 검증 중 React 19.2.8 + `@mindfusion/diagramming-react` 4.9.0 조합에서 추가 제한을 확인했다. StrictMode의 개발용 mount → dispose → 재부착 순서에서 래퍼의 `dispose()`가 재사용된 Diagram의 항목을 늦게 제거해, `nodes.length` 복구 시점과 실제 core view의 모델 연결이 어긋나 canvas가 비어 보였다. 자동 수치는 복구할 수 있어도 실제 노드가 그려지지 않는 상태이므로 성공으로 간주하지 않았다.

따라서 이번 1차 구현의 루트에서는 StrictMode를 활성화하지 않았다. 대신 모든 예제는 초기화 시작과 cleanup에서 `clearAll()`을 호출하고 재실행 시 같은 초기화 함수를 사용해 중복을 방지한다. 향후 래퍼 버전에서 이 dispose 경쟁 상태가 해결됐는지 다시 검증한 뒤 StrictMode를 켠다.

## 11. 이벤트 등록 방식

React 래퍼 선언 파일은 `onNodeClicked`, `onNodeModified`, `onSelectionChanged`, `onDiagramChanged` 등 `on...` props를 제공한다. 이번 1차 예제는 상태 검증에 직접 이벤트가 필요하지 않지만, 다음 단계에서는 래퍼의 JSX 이벤트 prop을 우선 사용한다.

core API를 직접 사용할 경우 Diagram 이벤트는 `EventDispatcher`이며 `addEventListener(handler)`와 `removeEventListener(handler)`를 제공한다. 직접 등록했다면 같은 handler 참조로 반드시 해제해야 한다.

## 12. 배경과 격자

- 일반 배경은 `diagram.backBrush` 또는 React 래퍼의 `backBrush` prop으로 설정할 수 있다.
- core Diagram의 배경과 별도로, 호스트 컨테이너 CSS에도 배경을 줄 수 있다.
- 학습 예제에서는 차이를 보여주기 위해 Diagram 자체 배경과 CSS 격자 배경을 구분한다.
- React 래퍼는 `showGrid` prop을 지원하지만, 01-03에서는 눈에 잘 보이고 설명 가능한 CSS 격자도 함께 제공한다.

## 13. 확인되지 않았거나 이번 범위에서 사용하지 않는 API

다음은 export 존재 여부만 확인했거나 아예 검증하지 않았으며 이번 구현에 사용하지 않는다.

- `ControlNode`와 HTML DOM 호스팅 방식
- 복합 노드와 카드 콘텐츠
- 트리 연결 및 재귀 접기·펼치기
- 레이아웃 알고리즘
- 연결선 라우팅과 화살표
- 라이선스 배포 설정
- 저장/불러오기와 데이터 직렬화
- `DiagramView` core 객체를 직접 생성하는 비-React 방식

## 14. 다음 단계에서 주의할 사항

- HTML 노드는 `ControlNode`라는 이름만 보고 API를 추측하지 말고 실제 샘플과 브라우저 동작을 다시 확인한다.
- 선택 이벤트는 래퍼 prop의 실제 인자 순서를 브라우저에서 검증한 뒤 사용한다.
- 트리 접기/펼치기는 노드의 `expandable` 속성만으로 충분하다고 가정하지 않는다.
- 노드 내부 DOM 버튼과 canvas 좌표계의 이벤트 충돌을 확인해야 한다.
- 라이브러리 버전을 올릴 때는 `@mindfusion/diagramming-react`의 React peer dependency와 core package 간 호환성을 다시 확인한다.

## 15. 조사 근거

- 설치된 각 패키지의 `package.json`
- `@mindfusion/diagramming/diagramming.d.ts`
- `@mindfusion/diagramming/dist/esm/diagramming.mjs`
- `@mindfusion/diagramming-react/diagramming-react.d.ts`
- `@mindfusion/diagramming-react/dist/esm/diagramming.react.js`
- MindFusion 공식 React 문서
- MindFusion 공식 JavaScript Diagram Model 및 Factory API 문서
# 2차 개발 API 재확인 (2026-07-30)

설치된 패키지 선언 파일을 다시 확인했다.

- `@mindfusion/diagramming` 4.9.1
- `@mindfusion/diagramming-react` 4.9.0
- `@mindfusion/drawing` 4.4.0

## 일반 노드 내부 콘텐츠

- `ShapeNode.textPadding`은 `@mindfusion/drawing`의 `Thickness`를 사용한다.
- `ShapeNode.font`는 `Font` 인스턴스를 받는다.
- 텍스트 외곽선은 `textStroke`, `textStrokeThickness`로 지정한다.
- 텍스트 경계 처리는 `clipText`, 크기 맞춤은 `resizeToFitText(FitSize)`로 수행한다.

## 선택과 이벤트

- `diagram.selection`은 `Selection`을 반환한다.
- `Selection.addItem(item)`은 Promise를 반환하며, `clear()`, `nodes`, `items`를 제공한다.
- 다중 선택은 `diagram.allowMultipleSelection`으로 설정한다.
- React 래퍼에서 `onNodeClicked`, `onNodeDoubleClicked`, `onSelectionChanged`를 확인했다.
- 이벤트 인자는 각각 `NodeEventArgs.node`, `SelectionChangedEventArgs.oldItems/newItems`를 제공한다.

## 연결선

- `diagram.factory.createDiagramLink(origin, destination)`는 연결선을 생성하고 Diagram에 등록한다.
- `DiagramLink.text`, `stroke`, `strokeThickness`, `strokeDashStyle`을 사용할 수 있다.
- 경로는 `LinkShape.Bezier`, `Polyline`, `Cascading`, `Spline`을 제공한다.
- 끝 모양은 `ArrowHeads.Triangle()`, `Circle()`, `Arrow()`, `None()` 등을 제공한다.

## 범위 제한

이번 확인과 구현은 03~05까지만 적용했다. 06 이후 트리, HTML 노드, 카드 관련 API는 구현하지 않았다.
