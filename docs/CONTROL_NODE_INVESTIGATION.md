# ControlNode 조사 기록

> 조사 대상: `@mindfusion/diagramming` 4.9.1, `@mindfusion/diagramming-react` 4.9.0  
> 최초 조사일: 2026-08-01  
> 상태: 패키지·공식 예제 분석, 브라우저 최소 예제 및 대안 비교 검증 완료

## 1. 설치된 패키지 버전

`package.json`과 실제 설치 패키지의 `package.json`을 함께 확인했다.

| 패키지 | 버전 |
| --- | --- |
| `@mindfusion/diagramming` | 4.9.1 |
| `@mindfusion/diagramming-react` | 4.9.0 |

코어 선언 파일의 `ControlNode` 생성자는 다음과 같다.

```ts
class ControlNode extends DiagramNode {
  constructor(diagramView?: any);
  template: string;
  content: any[];
  getContent(): HTMLDivElement;
}
```

중요한 점은 생성자 인수가 모델 `Diagram`이 아니라 화면을 그리는 코어 `DiagramView`라는 것이다.

설치 패키지의 ESM 구현 번들은 난독화·압축되어 있지만 선언과 런타임을 함께 확인했다.
생성자는 전달된 View를 내부 `_diagramView`로 유지하며, 노드를 Diagram에 추가하면 View 위에
콘텐츠 div를 만들고 `nodeDomCreated`를 발생시킨다. `template` setter, `content`,
`getContent()`, 콘텐츠 표시 제어와 handler 연결 코드가 설치 번들에 포함되어 있다.

## 2. 공식 예제 방식

현재 공식 JavaScript 샘플의 `ControlNodes.js`는 다음 순서로 동작한다.

```js
const diagramView = DiagramView.create(document.getElementById('diagram'));
const diagram = diagramView.diagram;

diagram.addEventListener('nodeDomCreated', onNodeDomCreated);

const node = new ControlNode(diagramView);
node.template = `
  <div>
    <span>HTML content</span>
    <button data-interactive="true">확인</button>
  </div>`;
node.bounds = new Rect(20, 20, 80, 40);
diagram.addItem(node);
```

- `template` 문자열이 노드 위의 HTML 콘텐츠가 된다.
- 내부 버튼·입력처럼 포인터 입력을 받아야 하는 요소에는 `data-interactive="true"`가 필요하다.
- DOM이 페이지에 추가된 시점은 `nodeDomCreated` 이벤트로 확인한다.
- 이벤트 시점에 `args.node.getContent().querySelector(...)`로 실제 DOM을 찾을 수 있다.
- ControlNode HTML은 캔버스의 일반 도형과 달리 DOM 오버레이이므로 다른 다이어그램 항목보다 위에 표시된다.

참고 자료:

- [ControlNode API](https://mindfusion.dev/docs/javascript/diagramming/T_MindFusion_Diagramming_ControlNode_0.htm)
- [nodeDomCreated 이벤트](https://www.mindfusion.dev/docs/javascript/diagramming/E_MindFusion_Diagramming_DiagramBase_nodeDomCreated.htm)
- [공식 JavaScript Diagram 샘플 저장소](https://github.com/MindFusionComponents/JavaScript-Diagram-Samples)

## 3. React 래퍼에서의 차이

React 래퍼는 `<DiagramView diagram={diagram}>`을 마운트할 때 내부에서 코어
`DiagramView.create(canvas, diagram)`을 호출한다. 따라서 React 렌더 전에는
`ControlNode`가 요구하는 코어 View가 아직 존재하지 않는다.

```jsx
const viewRef = useRef(null);

<DiagramView
  ref={viewRef}
  diagram={diagram}
  onControlLoaded={() => {
    const coreView = viewRef.current?.find();
    // coreView를 ControlNode 생성자에 전달한다.
  }}
  onNodeDomCreated={handleNodeDomCreated}
/>
```

- React ref 자체는 코어 View가 아니다. `ref.current.find()`가 실제 코어 View를 반환한다.
- `onNodeDomCreated` prop은 코어 `diagram.nodeDomCreated` 이벤트에 연결된다.
- `onControlLoaded` 뒤에 노드를 만들어야 View가 준비된 상태를 보장할 수 있다.
- 래퍼는 언마운트 시 코어 View를 `dispose()`하지만, 애플리케이션이 DOM에 직접 등록한 이벤트 리스너는 직접 해제해야 한다.

## 4. `nodeDomCreated`, `template`, `content`, ref 확인 결과

| API | 설치본에서 확인한 의미 |
| --- | --- |
| `ControlNode.template` | 노드 내부에 생성할 HTML 문자열 |
| `ControlNode.content` | 선언 형식은 `any[]`로 부정확하지만 실제 4.9.1 런타임에서는 `querySelector` 가능한 콘텐츠 DOM |
| `ControlNode.getContent()` | 생성된 루트 `HTMLDivElement` 반환 |
| `Events.nodeDomCreated` | ControlNode 콘텐츠가 페이지 DOM에 추가될 때 발생 |
| React `onNodeDomCreated` | 래퍼가 모델 Diagram 이벤트에 연결하는 prop |
| React `DiagramView` ref | `{ find(): core DiagramView | null }` 형태의 facade |

## 5. 흰색 빈 박스만 표시되는 원인 후보

1. `new ControlNode(diagram)`처럼 모델을 생성자에 전달해 코어 View 연결이 없는 경우
2. React View가 마운트되기 전에 ControlNode를 생성한 경우
3. `template`을 설정하기 전에 노드를 추가했거나 비어 있는 기본 템플릿을 사용한 경우
4. 라이브러리 CSS가 로드되지 않아 ControlNode DOM의 위치·크기가 깨진 경우
5. 템플릿 내부 요소의 색상이 배경과 같거나 크기가 0인 경우
6. DOM 생성 전에 `content`/`getContent()`를 조회한 경우
7. 버튼에 `data-interactive="true"`가 없어 Diagram이 포인터 입력을 가로챈 경우

## 6. 최소 코드

현재 설치본에 맞는 최소 코드는 다음 형태다. 이 코드는 09-01로 브라우저에서 실행했고,
Playwright가 실제 `[data-mf-html-node="09-01"]` DOM과 텍스트를 확인했다.

```jsx
import { useRef, useState } from 'react';
import { ControlNode, Diagram, Rect } from '@mindfusion/diagramming';
import { DiagramView } from '@mindfusion/diagramming-react';

export default function MinimalControlNode() {
  const [diagram] = useState(() => new Diagram());
  const viewRef = useRef(null);
  const initialized = useRef(false);

  const initialize = () => {
    if (initialized.current) return;
    const coreView = viewRef.current?.find();
    if (!coreView) return;

    initialized.current = true;
    const node = new ControlNode(coreView);
    node.template = '<div data-testid="html-node-text">HTML 텍스트</div>';
    node.bounds = new Rect(40, 30, 90, 45);
    diagram.addItem(node);
  };

  return (
    <DiagramView
      ref={viewRef}
      diagram={diagram}
      onControlLoaded={initialize}
    />
  );
}
```

## 7. 실패한 코드와 실패 이유

```jsx
const [diagram] = useState(() => new Diagram());
const node = new ControlNode(diagram);
diagram.addItem(node);
```

이 코드는 현재 React 구성에서 잘못된 객체를 생성자에 전달한다. 설치된 4.9.1
선언과 최신 공식 샘플은 코어 `DiagramView`를 요구한다. 과거 블로그의
`new ControlNode(diagram)` 예제는 현재의 모델/View 분리 구조에 그대로 적용하면 안 된다.
계약상 잘못된 객체를 넘기는 실패 코드이므로 제품 예제에는 넣지 않았고, 빈 흰색 콘텐츠나
View 연결 실패를 정상 결과로 간주하지 않았다.

```jsx
const node = new ControlNode(viewRef.current?.find());
```

컴포넌트 렌더 중 실행하면 ref가 아직 `null`이므로 실패한다. `onControlLoaded` 또는
마운트 이후 effect에서 실행해야 한다.

## 8. 대체 구현 방식 비교

| 방식 | 실제 HTML DOM | Diagram 이동·줌 동기화 | React 컴포넌트 사용 | 확인된 장점 | 확인된 제약 |
| --- | --- | --- | --- | --- | --- |
| `ControlNode` | 예 | 라이브러리 내장 | 템플릿은 문자열 | 실제 DOM과 노드 좌표가 함께 동작 | 생성 시 코어 View 필요, DOM이 항상 위에 렌더링 |
| `CompositeNode` | 아니요 | 라이브러리 내장 | 아니요 | JSON 템플릿 복합 도형이 캔버스에 정상 표시 | 실제 HTML 버튼/DOM 이벤트 불가 |
| React Portal | 예 | 직접 구현 | 예 | Portal DOM과 React 상태 사용 가능 | 좌표 변환과 이동·줌 동기화를 직접 관리 |
| 외부 DOM Overlay | 예 | 직접 구현 | 선택 사항 | 일반 DOM이 정상 표시되고 구현이 단순 | 스크롤·줌·레이아웃 변화 때 위치 보정 필요 |

09-04에서 네 방식을 실제로 함께 렌더링했다. Diagram 모델에는 ControlNode와
CompositeNode 2개가 있었고, 브라우저 DOM에는 ControlNode·Portal·Overlay 3개가 존재했다.
CompositeNode는 DOM 검색 결과에 포함되지 않았다.

최종 구현은 **ControlNode**를 선택했다. 이 범위의 핵심인 실제 HTML 버튼을 제공하면서
노드 이동과 Diagram 좌표 동기화를 MindFusion이 처리하기 때문이다. React Portal과 외부
Overlay는 실제 HTML에는 성공했지만 좌표 동기화를 직접 구현해야 하므로 기본 방식으로 선택하지 않았다.

## 9. 검증 체크리스트

- [x] ControlNode 최소 HTML 텍스트가 실제 DOM에 존재
- [x] `nodeDomCreated`가 발생하고 `getContent()`로 DOM 검색 성공
- [x] 런타임 `content`에서도 DOM `querySelector` 사용 가능
- [x] `data-interactive="true"` 버튼 클릭 성공
- [x] 버튼 클릭이 노드 이동으로 처리되지 않음
- [x] 동일 리스너 중복 등록 없음(의도적 2회 연결 호출 후 실제 1회)
- [x] 컴포넌트 제거 시 직접 등록한 리스너 해제
- [x] CompositeNode는 DOM이 아닌 캔버스 항목임을 확인
- [x] React Portal 및 외부 Overlay DOM 존재 확인
- [x] Playwright 신규 테스트 통과
- [x] `npm run build` 통과

## 10. 실제 검증 결과

- 09-01 최소 ControlNode: HTML 텍스트 DOM 1개 생성 성공
- 09-04 비교: Diagram 노드 2개, HTML 대안 DOM 3개 확인
- 10-02: `getContent()`와 런타임 `content` 모두에서 `querySelector` 가능
- 11-01: 버튼 한 번 클릭 시 이벤트 1회
- 11-02: 버튼 클릭 뒤 초기 `bounds` 유지
- 11-03: 연결 함수를 두 번 호출해도 등록 1회, 클릭 1회
- 11-04: 다른 메뉴로 이동해 컴포넌트를 제거했을 때 리스너 해제 1회
- 신규 Playwright 묶음: 2개 테스트 통과, 브라우저 콘솔 오류 0개
- Vite production build 성공. 번들 크기 경고는 있으나 빌드 오류는 없다.
