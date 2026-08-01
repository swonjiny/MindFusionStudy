const categoryContent = {
  "01": { analogy: "Diagram은 도화지에 올릴 내용을 보관하는 상자이고, DiagramView는 그 상자를 화면에 보여주는 액자입니다.", why: "모델과 화면을 분리해서 이해하면 이후 노드와 연결선을 어디에 추가해야 하는지 헷갈리지 않습니다.", action: "Diagram을 한 번 만들고 DiagramView에 전달하는 흐름을 확인합니다.", mistake: "렌더링할 때마다 new Diagram()을 호출하면 기존 노드와 선택 상태가 사라질 수 있습니다." },
  "02": { analogy: "ShapeNode는 다이어그램 위에 붙이는 메모지 한 장과 같습니다. Rect는 메모지를 놓을 위치와 크기입니다.", why: "노드 생성, 위치, 크기, 글자와 스타일은 모든 다이어그램 기능의 출발점입니다.", action: "노드를 만들고 bounds와 표시 속성을 지정한 뒤 Diagram에 등록합니다.", mistake: "Factory로 만든 노드는 이미 Diagram에 들어 있으므로 addItem을 다시 호출하면 중복될 수 있습니다." },
  "03": { analogy: "노드 바깥 모양이 상자라면 이번 단계는 상자 안의 글자를 읽기 좋게 편집하는 작업입니다.", why: "내용이 길거나 글꼴이 달라도 정보가 잘리지 않고 읽히도록 만드는 방법을 배웁니다.", action: "텍스트 속성을 적용한 노드와 적용하지 않은 노드를 나란히 비교합니다.", mistake: "글자가 보이지 않으면 노드 크기, 글자색, 여백과 clipText를 함께 확인해야 합니다." },
  "04": { analogy: "선택은 사용자가 ‘이 노드로 작업하겠다’고 표시하는 것이고, 이벤트는 그 행동을 코드에 알려주는 신호입니다.", why: "선택과 클릭을 상태로 연결해야 상세 패널, 편집 도구와 카드 펼치기 같은 기능을 만들 수 있습니다.", action: "사용자 입력을 이벤트 prop으로 받고 Selection API와 React 상태를 갱신합니다.", mistake: "클릭과 선택은 같은 개념이 아닙니다. 클릭 이벤트만 처리하면 선택 목록은 바뀌지 않을 수 있습니다." },
  "05": { analogy: "DiagramLink는 두 메모지 사이에 관계와 방향을 표시하는 화살표입니다.", why: "노드만 배치하는 것을 넘어 흐름, 계층과 관계를 표현할 수 있습니다.", action: "출발 노드와 도착 노드를 먼저 만든 다음 두 노드로 연결선을 생성합니다.", mistake: "노드가 Diagram에 등록되기 전에 연결선을 만들면 출발점이나 도착점이 올바르게 계산되지 않습니다." },
  "06": { analogy: "부모·자식 트리는 회사 조직도나 폴더 구조처럼 위에서 아래로 이어지는 관계입니다.", why: "접기·펼치기와 자동 배치를 구현하려면 먼저 부모에서 자식으로 이어지는 링크 구조가 필요합니다.", action: "부모에서 나가는 outgoingLinks를 기준으로 자식과 손자 관계를 구성합니다.", mistake: "화면상의 위치만 보고 부모·자식을 판단하지 말고 실제 연결선의 origin과 destination을 사용해야 합니다." },
  "07": { analogy: "TreeLayout은 여러 노드를 사람이 하나씩 옮기지 않아도 보기 좋게 정렬해 주는 자동 정리 도구입니다.", why: "데이터가 늘어나도 일정한 방향과 간격의 트리를 유지할 수 있습니다.", action: "트리를 만든 뒤 TreeLayout 옵션을 설정하고 Diagram.arrange를 실행합니다.", mistake: "레이아웃은 노드와 연결선이 모두 생성된 다음 실행해야 전체 구조를 올바르게 계산합니다." },
  "08": { analogy: "접기는 데이터를 삭제하는 것이 아니라 서랍 안에 잠시 숨기는 동작입니다.", why: "큰 트리에서 필요한 부분만 보여주면서 다시 펼칠 때 기존 구조를 복원할 수 있습니다.", action: "부모에서 시작해 자식 노드와 연결선의 visible·expanded 상태를 함께 변경합니다.", mistake: "노드만 숨기고 연결선을 남기면 화면에 끊어진 선이 보이므로 두 상태를 항상 같이 처리합니다." },
  "09": { analogy: "ControlNode는 캔버스 위에 실제 HTML 명찰을 올려놓는 방식입니다.", why: "일반 ShapeNode보다 자유로운 글자, 이미지와 웹 요소를 노드 안에 표시할 수 있습니다.", action: "DiagramView의 실제 core view를 얻은 뒤 ControlNode와 template을 만들고 DOM 생성 시점을 확인합니다.", mistake: "ControlNode 생성자에 core view를 전달하지 않거나 부모 높이가 0이면 흰색 빈 영역만 보일 수 있습니다." },
  "10": { analogy: "HTML 노드 안의 버튼은 모양만 있는 그림이 아니라 querySelector로 찾을 수 있는 실제 DOM 요소입니다.", why: "다음 단계에서 클릭 이벤트를 안전하게 연결하려면 DOM 생성 시점과 검색 방법을 알아야 합니다.", action: "template에 data-interactive 버튼을 만들고 nodeDomCreated 이후 getContent에서 검색합니다.", mistake: "DOM이 생성되기 전에 querySelector를 실행하면 버튼을 찾을 수 없습니다." },
  "11": { analogy: "이벤트 리스너는 버튼을 누르는 순간 실행할 함수를 버튼에 연결하는 약속입니다.", why: "버튼 입력을 노드 이동과 분리하고, 중복 실행이나 메모리 누수 없이 관리할 수 있습니다.", action: "DOM 생성 후 리스너를 한 번 등록하고, 클릭을 처리한 뒤 unmount에서 같은 함수로 해제합니다.", mistake: "렌더링할 때마다 새 리스너를 추가하면 한 번 클릭해도 여러 번 실행될 수 있습니다." },
  "12": { analogy: "카드 배열은 명함 여러 장의 원본 데이터이고 map은 각 데이터를 같은 모양의 카드로 찍어내는 과정입니다.", why: "데이터 개수가 바뀌어도 반복 가능한 UI와 자동 크기 계산을 만들 수 있습니다.", action: "배열을 map으로 HTML 카드로 바꾸고 카드 수에 맞춰 ControlNode 크기를 계산합니다.", mistake: "고정 높이만 사용하면 카드가 늘어날 때 아래 내용이 잘릴 수 있습니다." },
  "13": { analogy: "축약 카드는 요약본이고 펼친 카드는 상세본입니다. 선택이나 버튼이 두 상태를 전환합니다.", why: "복잡한 정보를 평소에는 작게 유지하고 사용자가 원할 때만 자세히 보여줄 수 있습니다.", action: "현재 펼침 상태에 따라 template HTML과 Rect 크기를 함께 교체합니다.", mistake: "HTML만 바꾸고 bounds를 복원하지 않으면 닫힌 뒤에도 큰 빈 노드가 남습니다." },
  "14": { analogy: "실제 서비스의 카드 데이터는 이미지가 깨지거나 비어 있을 수 있으므로 안전망이 필요합니다.", why: "정상 데이터뿐 아니라 이미지 오류, 빈 배열과 카드 선택까지 처리하는 견고한 노드를 만듭니다.", action: "데이터 상태에 맞는 HTML을 만들고 오류·클릭 이벤트를 DOM 생성 후 연결합니다.", mistake: "외부 이미지 오류를 처리하지 않으면 깨진 이미지 아이콘만 표시될 수 있습니다." },
  "15": { analogy: "HTML 루트는 풍부한 표지판이고 ShapeNode 자식들은 가볍게 연결되는 조직 구성원입니다.", why: "앞에서 배운 카드와 트리를 한 구조에서 함께 사용하는 방법을 익힙니다.", action: "JSON의 parentId를 기준으로 HTML 루트, 자식·손자 노드와 연결선을 만듭니다.", mistake: "루트와 자식의 ID 매핑이 어긋나면 연결선의 대상 노드를 찾을 수 없습니다." },
  "16": { analogy: "외부 도구 패널은 지도 앱의 확대 버튼과 정보 창처럼 다이어그램 밖에서 화면을 조작합니다.", why: "사용자가 큰 다이어그램을 탐색하고 선택한 항목의 정보를 쉽게 확인할 수 있습니다.", action: "DiagramView ref로 core view를 얻고 선택 노드를 기준으로 이동·확대·맞춤을 실행합니다.", mistake: "ref가 준비되기 전에 zoomToFit이나 scrollTo를 호출하면 동작하지 않습니다." },
  "17": { analogy: "데이터 연동은 완성된 그림을 저장하는 대신 설계도인 JSON을 받아 같은 그림을 만드는 과정입니다.", why: "실제 API의 로딩, 실패와 빈 응답을 구분해야 사용자에게 정확한 상태를 보여줄 수 있습니다.", action: "비동기 결과를 상태로 저장하고 success·loading·error·empty에 맞는 화면을 렌더링합니다.", mistake: "오류와 정상적인 빈 데이터를 같은 상태로 처리하면 사용자가 다시 시도해야 하는지 알 수 없습니다." },
  "18": { analogy: "검증은 완성된 다이어그램의 노드, 선, DOM과 상태를 체크리스트로 대조하는 과정입니다.", why: "화면이 얼핏 정상이어도 숨은 노드 수나 이벤트 오류를 자동으로 발견할 수 있습니다.", action: "검색·필터 실행 후 모델 상태와 실제 DOM을 읽어 예상값과 비교합니다.", mistake: "화면의 모양만 확인하지 말고 visible 상태와 콘솔 오류도 함께 검사합니다." },
  "19": { analogy: "최종 예제는 지금까지 만든 부품을 새로 만드는 것이 아니라 하나의 완성된 탐색기로 조립한 결과입니다.", why: "데이터, 트리, 카드, 도구 패널과 검증이 같은 상태를 공유하는 전체 흐름을 이해할 수 있습니다.", action: "공통 훅에서 상태와 동작을 관리하고 화면 구성 요소가 필요한 기능을 조합해 사용합니다.", mistake: "기능별로 Diagram을 따로 만들면 선택, 검색과 상세 패널 상태가 서로 일치하지 않습니다." },
};

const glossary = {
  Diagram: "노드와 연결선을 보관하는 데이터 모델입니다.",
  DiagramView: "Diagram 모델을 브라우저 화면에 그리고 사용자 입력을 전달하는 React 컴포넌트입니다.",
  ShapeNode: "사각형 등 기본 도형으로 표시되는 일반 노드입니다.",
  Rect: "x, y 위치와 width, height 크기를 함께 나타냅니다.",
  DiagramFactory: "노드와 연결선을 만들고 Diagram에 바로 등록하는 생성 도우미입니다.",
  Selection: "현재 선택된 노드와 연결선의 목록을 관리합니다.",
  DiagramLink: "두 노드를 이어 관계와 방향을 표현합니다.",
  TreeLayout: "연결 관계를 읽어 트리 모양으로 자동 배치합니다.",
  ControlNode: "Diagram 위에 실제 HTML DOM을 표시하는 노드입니다.",
  CompositeNode: "여러 시각 요소를 조합해 구성하는 MindFusion 노드입니다.",
  template: "ControlNode 내부에 렌더링할 HTML 문자열입니다.",
  nodeDomCreated: "ControlNode의 실제 DOM이 생성된 뒤 발생하는 이벤트입니다.",
  getContent: "ControlNode가 만든 HTML 컨테이너를 가져옵니다.",
  querySelector: "조건에 맞는 실제 HTML 요소 하나를 찾습니다.",
  "data-interactive": "HTML 요소의 클릭을 노드 드래그와 구분하기 위한 표시입니다.",
  visible: "노드나 연결선을 화면에 보일지 결정하는 상태입니다.",
  expanded: "부모 노드가 펼쳐진 상태인지 나타냅니다.",
  outgoingLinks: "현재 노드에서 자식 방향으로 나가는 연결선 목록입니다.",
  Promise: "나중에 완료되거나 실패하는 비동기 작업의 결과를 표현합니다.",
  JSON: "서버와 주고받기 쉬운 텍스트 기반 데이터 형식입니다.",
  Map: "ID와 노드를 짝지어 빠르게 찾을 수 있게 보관하는 자료구조입니다.",
  "React state": "화면이 기억하고 변화할 때 다시 렌더링하는 값입니다.",
  addEventListener: "HTML 요소에 클릭 같은 브라우저 이벤트 함수를 연결합니다.",
  removeEventListener: "앞서 연결한 이벤트 함수를 안전하게 제거합니다.",
  "Array.map": "배열의 각 데이터를 같은 규칙의 화면 요소로 변환합니다.",
  zoomFactor: "DiagramView의 현재 확대 비율입니다.",
  zoomToFit: "모든 노드가 화면 안에 들어오도록 확대율과 위치를 맞춥니다.",
  scrollTo: "지정한 다이어그램 좌표가 보이도록 화면을 이동합니다.",
};

const explainObject = (name) => glossary[name] || `이번 예제에서 ${name} 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.`;
const safeTable = (value) => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");

export function getBeginnerLessonContent(lesson) {
  const category = categoryContent[lesson.category] || categoryContent["01"];
  const objects = lesson.objects.map((name) => ({ name, description: explainObject(name) }));
  const flow = [
    "React 컴포넌트가 처음 렌더링될 때 Diagram 모델을 한 번 준비합니다.",
    `${lesson.objects.slice(0, 2).join("와 ") || "필요한 API"}를 사용해 이번 단계의 설정과 항목을 만듭니다.`,
    category.action,
    `실행 후 노드 ${lesson.expectedNodes}개와 연결선 ${lesson.expectedLinks}개, 콘솔 오류 0개인지 확인합니다.`,
  ];
  const checks = [
    `노드가 정확히 ${lesson.expectedNodes}개 표시되는지 확인합니다.`,
    `연결선이 정확히 ${lesson.expectedLinks}개 표시되는지 확인합니다.`,
    lesson.eventKind ? "버튼·선택·검색 등 사용자 동작 결과가 즉시 바뀌는지 확인합니다." : "예상 실행 결과가 설명과 같은지 눈으로 비교합니다.",
    lesson.tracksTreeState ? "접기·펼치기 뒤 visible 노드와 연결선 수가 함께 바뀌는지 확인합니다." : null,
    lesson.tracksHtmlDom ? "개발자 도구에서 실제 HTML DOM이 생성되었는지 확인합니다." : null,
    lesson.tracksCardState ? "카드 데이터 수와 화면의 카드 DOM 수가 일치하는지 확인합니다." : null,
    lesson.tracksIntegrated ? "데이터 상태와 실제 트리 상태가 검증 패널 기준과 일치하는지 확인합니다." : null,
    "브라우저 콘솔에 빨간 오류가 없는지 확인합니다.",
  ].filter(Boolean);
  return {
    analogy: category.analogy,
    why: category.why,
    action: category.action,
    mistake: category.mistake,
    objects,
    flow,
    checks,
  };
}

export function buildBeginnerGuideMarkdown(lesson, originalMarkdown = "") {
  const content = getBeginnerLessonContent(lesson);
  const objectRows = content.objects.length
    ? content.objects.map(({ name, description }) => `| \`${safeTable(name)}\` | ${safeTable(description)} |`).join("\n")
    : "| 없음 | 이 단계는 별도 MindFusion 객체 없이 화면 구조를 이해합니다. |";
  const technicalBody = originalMarkdown.replace(/^# .+\r?\n/, "").trim();
  return `# ${lesson.key} ${lesson.title} — 초보자 개발 가이드

> ${lesson.description}

## 1. 먼저 큰 그림부터 이해하기

${content.analogy}

**왜 배우나요?** ${content.why}

이 예제의 최종 목표는 **노드 ${lesson.expectedNodes}개, 연결선 ${lesson.expectedLinks}개**가 설명과 같은 상태로 실행되는 것입니다.

## 2. 코드에서 만나는 용어

| 용어 | 초보자를 위한 설명 |
| --- | --- |
${objectRows}

## 3. 코드가 실행되는 순서

${content.flow.map((step, index) => `${index + 1}. ${step}`).join("\n")}

처음에는 모든 코드를 외우려고 하지 말고, **모델 준비 → 항목 생성 → 속성·이벤트 적용 → 결과 확인** 순서를 찾는 데 집중하세요.

## 4. 직접 따라 하기

1. **소스 코드** 탭에서 독립 실행 JSX를 복사합니다.
2. **설치·사용 방법** 탭의 패키지 설치 명령을 실행합니다.
3. 안내된 \`main.jsx\`처럼 예제 컴포넌트를 렌더링합니다.
4. DiagramView 부모 요소에 높이가 지정되어 있는지 확인합니다.
5. 화면을 실행하고 아래 체크리스트와 비교합니다.

## 5. 실행 결과 체크리스트

${content.checks.map((check) => `- [ ] ${check}`).join("\n")}

## 6. 초보자가 자주 막히는 부분

> ${content.mistake}

- 화면이 비어 있으면 먼저 DiagramView 부모의 높이를 확인하세요.
- 노드 수가 두 배라면 초기화가 반복되거나 Factory 생성 결과를 다시 \`addItem\`했는지 확인하세요.
- 예제는 설치된 MindFusion Diagramming 4.9.x API를 기준으로 작성되어 있습니다.

## 7. 이전·다음 단계 연결

${lesson.previousLessonKey ? `- 이전 단계: **${lesson.previousLessonKey}**에서 만든 기반에 이번 기능을 추가합니다.` : "- 첫 단계: Diagram과 DiagramView의 관계부터 시작합니다."}
${lesson.nextLessonKey ? `- 다음 단계: **${lesson.nextLessonKey}**에서 현재 결과에 새로운 속성이나 동작을 더합니다.` : "- 마지막 단계: 지금까지 배운 기능을 최종 예제에서 함께 확인합니다."}

---

## 기존 기술 설명

${technicalBody || "이 예제의 기술 설명은 위 단계별 안내와 소스 코드 주석을 함께 참고하세요."}
`;
}

const commentText = (value) => String(value).replaceAll("*/", "* /").replaceAll("\n", " ");

function insertCommentBeforeFirst(source, token, comment) {
  const index = source.indexOf(token);
  if (index < 0) return source;
  return `${source.slice(0, index)}/* ${commentText(comment)} */\n${source.slice(index)}`;
}

export function annotateSourceForBeginners(lesson, source) {
  const content = getBeginnerLessonContent(lesson);
  const objectGuide = content.objects.length
    ? content.objects.map(({ name, description }) => ` * - ${commentText(name)}: ${commentText(description)}`).join("\n")
    : " * - 별도 객체 없음: 화면 구조와 렌더링 흐름에 집중합니다.";
  const header = `/**
 * ================================================================
 * [초보자용 상세 주석] ${lesson.key} ${commentText(lesson.title)}
 * ================================================================
 *
 * 이 파일에서 만드는 것
 * - ${commentText(lesson.description)}
 * - 예상 결과: 노드 ${lesson.expectedNodes}개, 연결선 ${lesson.expectedLinks}개
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
${objectGuide}
 *
 * 기억할 점
 * - Diagram은 데이터 모델이고 DiagramView는 그 모델을 화면에 표시하는 React 뷰입니다.
 * - Rect의 네 값은 순서대로 x, y, width, height입니다.
 * - onStatus는 학습 사이트의 검증 패널용 선택적 prop입니다. 외부 프로젝트에서는 전달하지 않아도 됩니다.
 * - StrictMode의 개발 환경 이중 마운트가 문제가 되면 안내된 main.jsx처럼 StrictMode 없이 먼저 확인하세요.
 * - ${commentText(content.mistake)}
 */
`;

  let annotated = source.trimStart();
  const annotations = [
    ["export default function", "[컴포넌트 시작] 이 함수가 외부에서 import해 렌더링하는 예제 컴포넌트입니다. props의 onStatus는 선택 사항입니다."],
    ["function useIntegratedDiagram", "[공통 훅] Diagram 모델, 선택, 트리 표시 상태, 검색과 화면 이동 동작을 한곳에서 관리합니다."],
    ["const integratedMockData =", "[예제 데이터] 실제 서버 대신 사용할 JSON 형태의 루트·자식·카드 데이터입니다. 같은 구조로 API 응답을 교체할 수 있습니다."],
    ["const cards =", "[카드 배열] 카드 수를 늘리거나 내용을 바꾸려면 먼저 이 배열의 객체를 수정합니다. map이 각 객체를 HTML 카드로 바꿉니다."],
    ["new Diagram()", "[Diagram 생성] 노드와 연결선을 보관할 모델을 만듭니다. useState의 초기 함수 안에서 만들면 React 재렌더링에도 같은 모델을 유지합니다."],
    ["new ShapeNode", "[일반 노드 생성] ShapeNode 객체만 만든 상태이며, bounds·text·스타일을 설정한 뒤 Diagram에 등록해야 화면에 나타납니다."],
    ["new ControlNode", "[HTML 노드 생성] ControlNode는 실제 HTML을 다이어그램 좌표에 표시합니다. 생성자에는 DiagramView의 core view가 필요합니다."],
    ["new Rect", "[위치와 크기] Rect(x, y, width, height)로 다이어그램 좌표상의 위치와 노드 크기를 함께 지정합니다."],
    ["diagram.addItem", "[모델에 등록] 직접 new로 만든 노드는 addItem을 호출해야 Diagram이 관리하고 DiagramView가 그릴 수 있습니다."],
    ["createShapeNode", "[Factory 생성] Factory 메서드는 노드를 만들면서 Diagram에 자동 등록합니다. 반환 노드를 다시 addItem하지 않습니다."],
    ["createDiagramLink", "[연결선 생성] 출발 노드와 도착 노드가 Diagram에 준비된 뒤 두 노드를 연결합니다."],
    ["const initialize =", "[초기화 함수] DiagramView가 준비된 뒤 한 번 실행되어 노드와 연결선을 구성합니다. 중복 실행 방지 조건을 먼저 확인하세요."],
    ["const domCreated =", "[DOM 생성 이벤트] ControlNode의 HTML이 실제 브라우저 DOM으로 만들어진 뒤 버튼·이미지를 안전하게 검색하고 이벤트를 연결합니다."],
    ["const selectionChanged =", "[선택 변경 처리] 현재 Selection 목록을 읽고 React 상태, 노드 크기 또는 내부 HTML을 선택 상태에 맞게 갱신합니다."],
    ["addEventListener", "[브라우저 이벤트 등록] DOM 요소와 handler 함수 쌍을 기억해야 cleanup에서 정확히 같은 함수로 제거할 수 있습니다."],
    ["useEffect", "[React 생명주기] effect는 렌더링 뒤 부수 작업을 수행하고, 반환 함수는 unmount 시 리스너와 Diagram 내용을 정리합니다."],
    ["<DiagramView", "[화면 렌더링] 준비한 Diagram 모델과 ref, 이벤트 함수를 DiagramView prop으로 전달합니다. 부모 요소에는 반드시 높이가 있어야 합니다."],
  ];
  annotations.forEach(([token, comment]) => {
    annotated = insertCommentBeforeFirst(annotated, token, comment);
  });
  return `${header}${annotated.trimEnd()}\n`;
}
