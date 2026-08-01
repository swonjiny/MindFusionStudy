import { expect, test } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readyLessons } from "../data/lessonMenus";
import { annotateSourceForBeginners, buildBeginnerGuideMarkdown } from "../data/beginnerGuideContent";

function collectBrowserErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

test("애플리케이션 공통 화면과 탭이 동작한다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "MindFusion 학습 가이드" })).toBeVisible();
  await expect(page.getByTestId("learning-menu")).toBeVisible();
  await expect(page.getByTestId("diagram-demo")).toBeVisible();
  await expect(page.getByTestId("verification-panel")).toBeVisible();

  await page.getByRole("tab", { name: "소스 코드" }).click();
  await expect(page.getByTestId("source-code-viewer")).toBeVisible();
  await expect(page.getByText("이 파일 하나만 복사하면 됩니다")).toBeVisible();
  await expect(page.getByRole("tab", { name: "독립 실행 JSX" })).toBeVisible();
  await page.getByRole("tab", { name: "설치·사용 방법" }).click();
  await expect(page.locator(".source-panel:visible")).toContainText("npm install react react-dom");

  await page.getByRole("tab", { name: "개발 가이드" }).click();
  await expect(page.getByTestId("markdown-guide")).toBeVisible();
  await expect(page.getByRole("heading", { name: /02-01 일반 노드 1개 생성/ })).toBeVisible();

  expect(errors).toEqual([]);
});

test("01~14 예제는 독립 실행되고 15~19는 공통 통합 모듈을 재사용한다", () => {
  const examplesRoot = join(process.cwd(), "src", "examples");
  const allFiles = readdirSync(examplesRoot, { recursive: true })
    .filter((file) => typeof file === "string" && /^(0[1-9]|1[0-4])-/.test(file) && file.endsWith(".jsx"));

  expect(allFiles).toHaveLength(69);
  for (const file of allFiles) {
    const source = readFileSync(join(examplesRoot, file), "utf8");
    expect(source, file).not.toContain('from "../');
    expect(source, file).not.toContain('from "./');
    expect(source, file).toContain("@mindfusion/diagramming");
    expect(source, file).toContain("@mindfusion/diagramming-react");
    expect(source, file).toContain("export default function");
  }

  const integratedFiles = readdirSync(examplesRoot, { recursive: true })
    .filter((file) => typeof file === "string" && /^(1[5-9])-/.test(file) && file.endsWith(".jsx"));
  expect(integratedFiles).toHaveLength(14);
  for (const file of integratedFiles) {
    const source = readFileSync(join(examplesRoot, file), "utf8");
    expect(source, file).toContain("features/integrated/IntegratedDiagramExample");
    expect(source, file).toContain("export default function");
  }

  const standaloneIntegrated = readFileSync(
    join(process.cwd(), "src", "features", "integrated", "IntegratedDiagramExample.jsx"),
    "utf8",
  );
  expect(standaloneIntegrated).not.toMatch(/from\s+["']\.{1,2}\//);
  expect(standaloneIntegrated).not.toMatch(/import\s+["']\.{1,2}\//);
  expect(standaloneIntegrated).toContain("function useIntegratedDiagram");
  expect(standaloneIntegrated).toContain("const integratedMockData");
  expect(standaloneIntegrated).toContain("const integratedCss");
});

test("15~19 소스 뷰어는 상대경로 없는 단일 실행 파일을 제공한다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("19. 완성 예제", { exact: true }).click();
  await page.getByText("19-01 최종 종합 예제", { exact: true }).click();
  await page.getByRole("tab", { name: "소스 코드" }).click();
  await expect(page.getByText("이 파일 하나만 복사하면 됩니다")).toBeVisible();
  await expect(page.getByRole("tab", { name: "독립 실행 JSX" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "공통 훅·유틸" })).toHaveCount(0);
  await expect(page.locator(".source-panel:visible")).toContainText("function useIntegratedDiagram");
  await expect(page.locator(".source-panel:visible")).toContainText("[초보자용 상세 주석] 19-01");
  await page.getByRole("tab", { name: "설치·사용 방법" }).click();
  await expect(page.locator(".source-panel:visible")).toContainText('variant="final"');
  expect(errors).toEqual([]);
});

test("모든 메뉴의 개발 가이드가 초보자용 필수 설명을 포함한다", () => {
  expect(readyLessons).toHaveLength(83);
  for (const lesson of readyLessons) {
    const original = readFileSync(join(process.cwd(), lesson.guidePath.slice(1)), "utf8");
    const guide = buildBeginnerGuideMarkdown(lesson, original);
    expect(guide, lesson.key).toContain(`${lesson.key} ${lesson.title} — 초보자 개발 가이드`);
    expect(guide, lesson.key).toContain("먼저 큰 그림부터 이해하기");
    expect(guide, lesson.key).toContain("코드에서 만나는 용어");
    expect(guide, lesson.key).toContain("코드가 실행되는 순서");
    expect(guide, lesson.key).toContain("직접 따라 하기");
    expect(guide, lesson.key).toContain("실행 결과 체크리스트");
    expect(guide, lesson.key).toContain("초보자가 자주 막히는 부분");
    expect(guide, lesson.key).not.toContain("undefined");
  }
});

test("모든 복사 소스가 메뉴별 초보자 상세 주석을 포함한다", () => {
  const examplesRoot = join(process.cwd(), "src", "examples");
  const standaloneFiles = readdirSync(examplesRoot, { recursive: true })
    .filter((file) => typeof file === "string" && /^(0[1-9]|1[0-4])-/.test(file) && file.endsWith(".jsx"));
  for (const file of standaloneFiles) {
    const match = file.match(/Step(\d{2})(\d{2})/);
    const key = `${match[1]}-${match[2]}`;
    const lesson = readyLessons.find((item) => item.key === key);
    const annotated = annotateSourceForBeginners(lesson, readFileSync(join(examplesRoot, file), "utf8"));
    expect(annotated, key).toContain(`[초보자용 상세 주석] ${key}`);
    expect(annotated, key).toContain("코드를 읽는 권장 순서");
    expect(annotated, key).toContain("이번 예제의 핵심 용어");
    expect(annotated, key).toContain("[컴포넌트 시작]");
    expect(annotated, key).not.toContain("undefined");
  }

  const integratedSource = readFileSync(join(process.cwd(), "src", "features", "integrated", "IntegratedDiagramExample.jsx"), "utf8");
  for (const lesson of readyLessons.filter((item) => Number(item.category) >= 15)) {
    const annotated = annotateSourceForBeginners(lesson, integratedSource);
    expect(annotated, lesson.key).toContain(`[초보자용 상세 주석] ${lesson.key}`);
    expect(annotated, lesson.key).toContain("[공통 훅]");
    expect(annotated, lesson.key).toContain("[예제 데이터]");
    expect(annotated, lesson.key).toContain("[화면 렌더링]");
  }
});

test("상세 설명과 개발 가이드가 선택한 메뉴에 맞게 바뀐다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("13. 선택 시 카드 펼치기", { exact: true }).click();
  await page.getByText("13-05 내부 버튼 펼치기", { exact: true }).click();
  await page.getByRole("tab", { name: "상세 설명" }).click();
  await expect(page.getByText("13-05를 한 문장으로 이해하기")).toBeVisible();
  await expect(page.getByText(/축약 카드는 요약본이고 펼친 카드는 상세본/)).toBeVisible();
  await expect(page.getByText("코드는 이 순서로 실행됩니다")).toBeVisible();
  await page.getByRole("tab", { name: "개발 가이드" }).click();
  await expect(page.getByRole("heading", { name: /13-05 카드 내부 버튼으로 펼치기·닫기 — 초보자 개발 가이드/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "4. 직접 따라 하기" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "6. 초보자가 자주 막히는 부분" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("구현된 모든 메뉴의 노드와 연결선 수가 검증된다", async ({ page }) => {
  test.setTimeout(60_000);
  const errors = collectBrowserErrors(page);
  const lessons = [
    ["01-01", "빈 Diagram", 0],
    ["01-02", "화면 크기", 0],
    ["01-03", "배경 설정", 0],
    ["02-01", "노드 1개", 1],
    ["02-02", "노드 2개", 2],
    ["02-03", "Factory 생성", 1],
    ["02-04", "직접 생성", 1],
    ["02-05", "생성 방식 비교", 2],
    ["02-06", "위치 변경", 1],
    ["02-07", "크기 변경", 1],
    ["02-08", "텍스트 표시", 1],
    ["02-09", "여러 줄 텍스트", 1],
    ["02-10", "텍스트 정렬", 3],
    ["02-11", "배경색", 3],
    ["02-12", "테두리", 3, 0],
    ["03-01", "텍스트 여백", 2, 0],
    ["03-02", "글꼴 스타일", 2, 0],
    ["03-03", "텍스트 외곽선", 2, 0],
    ["03-04", "텍스트 자르기", 2, 0],
    ["03-05", "텍스트 맞춤 크기", 2, 0],
    ["04-01", "클릭 이벤트", 2, 0],
    ["04-02", "단일 선택", 2, 0],
    ["04-03", "다중 선택", 3, 0],
    ["04-04", "선택 변경", 3, 0],
    ["04-05", "더블 클릭", 2, 0],
    ["05-01", "연결선 1개", 2, 1],
    ["05-02", "연결선 2개", 3, 2],
    ["05-03", "연결선 텍스트", 2, 1],
    ["05-04", "화살표 머리", 2, 1],
    ["05-05", "연결선 스타일", 3, 2],
  ];

  await page.goto("/");
  for (const [key, shortTitle, count, linkCount = 0] of lessons) {
    const category = key.slice(0, 2);
    const child = page.getByText(`${key} ${shortTitle}`, { exact: true });
    if (!(await child.isVisible())) {
      await page.getByText(new RegExp(`^${category}\\. `)).click();
    }
    await child.click();
    await page.getByRole("tab", { name: "실행 화면" }).click();
    await expect(page.locator(".lesson-number")).toHaveText(key);
    await expect(page.getByTestId("verification-2")).toContainText(`현재 ${count}개`);
    await expect(page.getByTestId("verification-2")).toContainText("success");
    await expect(page.getByTestId("verification-3")).toContainText(`현재 ${linkCount}개`);
    await expect(page.getByTestId("verification-3")).toContainText("success");
  }

  expect(errors).toEqual([]);
});

test("이전·다음 이동과 준비 중 화면이 동작한다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");

  await page.getByText("02-01 노드 1개", { exact: true }).click();
  await page.getByRole("button", { name: "다음 예제", exact: true }).click();
  await expect(page.locator(".lesson-number")).toHaveText("02-02");

  await page.getByRole("button", { name: "이전 예제", exact: true }).click();
  await expect(page.locator(".lesson-number")).toHaveText("02-01");

  await page.getByText("00. 시작하기", { exact: true }).click();
  await page.getByText("00-01 준비 중", { exact: true }).click();
  await expect(page.getByTestId("planned-lesson")).toBeVisible();
  await expect(page.getByText(/01부터 19까지의 단계별 예제/)).toBeVisible();

  expect(errors).toEqual([]);
});

test("06~08 트리 예제의 노드·연결선·visible·expanded 상태가 검증된다", async ({ page }) => {
  test.setTimeout(60_000);
  const errors = collectBrowserErrors(page);
  const lessons = [
    ["06-01", "부모와 자식 1개", 2, 1, 2, 1, 1],
    ["06-02", "자식 2개", 3, 2, 3, 2, 1],
    ["06-03", "자식 5개", 6, 5, 6, 5, 1],
    ["06-04", "손자 노드", 5, 4, 5, 4, 2],
    ["06-05", "3단계 트리", 7, 6, 7, 6, 3],
    ["07-01", "세로 자동 배치", 4, 3, 4, 3, 1],
    ["07-02", "배치 간격", 6, 5, 6, 5, 1],
    ["07-03", "가로 자동 배치", 4, 3, 4, 3, 1],
    ["07-04", "3단계 자동 배치", 7, 6, 7, 6, 3],
    ["07-05", "동적 재배치", 6, 5, 6, 5, 1, ["자식 추가 후 재배치"]],
    ["08-01", "자식·연결선 접기", 3, 2, 1, 0, 0, ["자식과 연결선 접기"]],
    ["08-02", "재귀 접기", 5, 4, 1, 0, 0, ["손자까지 재귀 접기"]],
    ["08-03", "상태 복원", 4, 3, 4, 3, 2, ["임시 접기", "기존 상태 복원"]],
    ["08-04", "전체 접기", 7, 6, 1, 0, 0, ["전체 접기"]],
    ["08-05", "전체 펼치기", 6, 5, 6, 5, 3, ["전체 펼치기"]],
    ["08-06", "깊이 제한 펼치기", 7, 6, 3, 2, 1, ["2단계까지만 펼치기"]],
  ];

  await page.goto("/");
  for (const [key, shortTitle, nodes, links, visibleNodes, visibleLinks, expanded, actions = []] of lessons) {
    const child = page.getByText(`${key} ${shortTitle}`, { exact: true });
    if (!(await child.isVisible())) await page.getByText(new RegExp(`^${key.slice(0, 2)}\\. `)).click();
    await child.click();
    await page.getByRole("tab", { name: "실행 화면" }).click();
    for (const action of actions) await page.getByRole("button", { name: action, exact: true }).click();
    await expect(page.getByTestId("verification-2")).toContainText(`현재 ${nodes}개`);
    await expect(page.getByTestId("verification-3")).toContainText(`현재 ${links}개`);
    await expect(page.getByTestId("verification-visible-nodes")).toContainText(`현재 ${visibleNodes}개`);
    await expect(page.getByTestId("verification-visible-links")).toContainText(`현재 ${visibleLinks}개`);
    await expect(page.getByTestId("verification-expanded")).toContainText(`expanded 부모 ${expanded}개`);
    await expect(page.getByTestId("verification-visible-nodes")).toContainText("success");
    await expect(page.getByTestId("verification-visible-links")).toContainText("success");
    await expect(page.getByTestId("verification-expanded")).toContainText("success");
  }
  expect(errors).toEqual([]);
});

test("선택 API와 선택 변경 이벤트가 검증된다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("04. 노드 선택과 이벤트", { exact: true }).click();
  await page.getByText("04-04 선택 변경", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();

  await page.getByRole("button", { name: "두 노드 선택" }).click();
  await expect(page.getByTestId("selected-count")).toContainText("선택 2개");
  await expect(page.getByTestId("verification-selection")).toContainText("success");
  await expect(page.getByTestId("verification-event")).toContainText("success");

  expect(errors).toEqual([]);
});

test("실제 캔버스 노드 클릭과 더블 클릭 이벤트가 수신된다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("04. 노드 선택과 이벤트", { exact: true }).click();
  await page.getByText("04-01 클릭 이벤트", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();
  const canvas = page.getByTestId("diagram-demo").locator("canvas").first();
  const box = await canvas.boundingBox();
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height * 0.35);
  await expect(page.getByTestId("event-count")).not.toContainText("0회");

  await page.getByText("04-05 더블 클릭", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();
  const secondBox = await page.getByTestId("diagram-demo").locator("canvas").first().boundingBox();
  await page.mouse.dblclick(secondBox.x + secondBox.width * 0.25, secondBox.y + secondBox.height * 0.35);
  await expect(page.getByTestId("last-event")).toContainText("더블 클릭");

  expect(errors).toEqual([]);
});

test("09-01 ControlNode가 실제 HTML DOM을 만든다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("09. HTML 요소 노드 기초", { exact: true }).click();
  await page.getByText("09-01 HTML 텍스트", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();

  await expect(page.locator('[data-mf-html-node="09-01"]')).toHaveText("실제 HTML 텍스트");
  await expect(page.getByTestId("verification-html-dom")).toContainText("success");
  expect(errors).toEqual([]);
});

test("09~10 HTML 노드와 네 가지 구현 방식이 실제 DOM 기준으로 검증된다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");

  const lessons = [
    ["09-01", "HTML 텍스트", 1, 0],
    ["09-02", "제목과 설명", 1, 0],
    ["09-03", "이미지", 1, 0],
    ["09-04", "대체 방식 비교", 3, 0],
    ["10-01", "버튼 모양", 1, 1],
    ["10-02", "버튼 DOM 검색", 1, 1],
  ];

  for (const [key, title, htmlCount, buttonCount] of lessons) {
    const item = page.getByText(`${key} ${title}`, { exact: true });
    if (!(await item.isVisible())) await page.getByText(new RegExp(`^${key.slice(0, 2)}\\. `)).click();
    await item.click();
    await page.getByRole("tab", { name: "실행 화면" }).click();
    await expect(page.getByTestId("verification-html-dom")).toContainText(`현재 ${htmlCount}개`);
    await expect(page.getByTestId("verification-html-dom")).toContainText("success");
    await expect(page.getByTestId("verification-button-dom")).toContainText(`현재 ${buttonCount}개`);
    await expect(page.getByTestId("verification-button-dom")).toContainText("success");
  }
  await expect(page.getByTestId("dom-search-result")).toContainText("content API DOM 확인");

  await expect(page.locator('[data-alternative="control"]')).toHaveCount(0);
  await page.getByText("09-04 대체 방식 비교", { exact: true }).click();
  await expect(page.locator('[data-alternative="control"]')).toHaveCount(1);
  await expect(page.locator('[data-alternative="portal"]')).toHaveCount(1);
  await expect(page.locator('[data-alternative="overlay"]')).toHaveCount(1);
  await expect(page.getByTestId("verification-2")).toContainText("현재 2개");
  expect(errors).toEqual([]);
});

test("11 HTML 버튼 클릭·입력 분리·중복 방지·cleanup이 동작한다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("11. HTML 노드 버튼 이벤트", { exact: true }).click();

  await page.getByText("11-01 버튼 클릭", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();
  await expect(page.locator('[data-mf-html-node="11-01"] button')).toHaveCount(3);
  const message = page.getByTestId("control-button-message");
  await page.getByTestId("control-select-button").click();
  await expect(message).toHaveText("현재 선택한 버튼은 ‘선택’ 버튼입니다.");
  await expect(page.getByTestId("control-select-button")).toHaveAttribute("aria-pressed", "true");
  await page.getByTestId("control-status-button").click();
  await expect(message).toHaveText("현재 노드는 정상적으로 실행 중입니다.");
  await page.getByTestId("control-help-button").click();
  await expect(message).toHaveText("같은 버튼을 다시 누르면 이 메시지가 사라집니다.");
  await page.getByTestId("control-help-button").click();
  await expect(message).toBeHidden();
  await expect(page.getByTestId("button-click-count")).toHaveText("버튼 클릭 4회");
  await expect(page.getByTestId("verification-event")).toContainText("success");

  await page.getByText("11-02 이동·클릭 분리", { exact: true }).click();
  await page.getByTestId("separated-button").click();
  await expect(page.getByTestId("separation-result")).toHaveText("버튼 클릭과 노드 이동이 분리됨");

  await page.getByText("11-03 중복 등록 방지", { exact: true }).click();
  await expect(page.getByTestId("listener-count")).toContainText("1회");
  await page.getByTestId("dedup-button").click();
  await expect(page.getByTestId("dedup-click-count")).toHaveText("클릭 1회");

  await page.getByText("11-04 이벤트 해제", { exact: true }).click();
  await page.getByTestId("cleanup-button").click();
  await expect(page.getByTestId("cleanup-status")).toContainText("클릭 1회");
  await page.getByText("11-03 중복 등록 방지", { exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__mfControlNodeCleanup)).toBe(1);
  expect(errors).toEqual([]);
});

test("12 카드 1·2·3·5개 예제가 배열과 실제 DOM 수를 검증한다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("12. 명함형 카드 콘텐츠", { exact: true }).click();
  for (const [key, title, count] of [["12-01", "카드 1개", 1], ["12-02", "카드 2개", 2], ["12-03", "카드 3개", 3], ["12-04", "카드 5개", 5]]) {
    await page.getByText(`${key} ${title}`, { exact: true }).click();
    await page.getByRole("tab", { name: "실행 화면" }).click();
    await expect(page.getByTestId("diagram-demo").locator("[data-card-id]")).toHaveCount(count);
    await expect(page.getByTestId("verification-card-count")).toContainText(`현재 ${count}개`);
    await expect(page.getByTestId("verification-card-dom")).toContainText(`현재 ${count}개`);
    await expect(page.getByTestId("verification-card-count")).toContainText("success");
    await expect(page.getByTestId("verification-card-expanded")).toContainText("success");
  }
  expect(errors).toEqual([]);
});

test("13 선택 시 확장하고 선택 해제 시 원래 카드 크기로 복원한다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("13. 선택 시 카드 펼치기", { exact: true }).click();

  await page.getByText("13-01 선택 전 축약", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();
  await expect(page.locator('[data-mf-card-node="13-01"]')).toHaveAttribute("data-expanded", "false");
  await expect(page.getByTestId("verification-card-dom")).toContainText("현재 0개");

  await page.getByText("13-02 선택 시 펼치기", { exact: true }).click();
  await page.getByRole("button", { name: "노드 선택", exact: true }).click();
  await expect(page.locator('[data-mf-card-node="13-02"]')).toHaveAttribute("data-expanded", "true");
  await expect(page.getByTestId("verification-card-selection")).toContainText("success");
  await expect(page.getByTestId("verification-card-expanded")).toContainText("success");

  await page.getByText("13-03 선택 해제 복원", { exact: true }).click();
  await expect(page.getByTestId("expand-state")).toContainText("선택 1개");
  await page.getByRole("button", { name: "선택 해제", exact: true }).click();
  await expect(page.getByTestId("expand-state")).toContainText("원래 크기 복원");
  await expect(page.locator('[data-mf-card-node="13-03"]')).toHaveAttribute("data-expanded", "false");

  await page.getByText("13-04 카드 수 크기 계산", { exact: true }).click();
  await page.getByRole("button", { name: "5개 카드로 펼치기", exact: true }).click();
  await expect(page.getByTestId("size-result")).toContainText("126 × 108");
  await expect(page.getByTestId("verification-card-dom")).toContainText("현재 5개");

  await page.getByText("13-05 내부 버튼 펼치기", { exact: true }).click();
  await expect(page.getByTestId("internal-expand-state")).toHaveText("축약 카드");
  await expect(page.locator('[data-mf-card-node="13-05"]')).toHaveAttribute("data-expanded", "false");
  await page.getByTestId("internal-expand-button").click();
  await expect(page.getByTestId("internal-expand-state")).toHaveText("5개 카드 펼침");
  await expect(page.locator('[data-mf-card-node="13-05"] [data-card-id]')).toHaveCount(5);
  await expect(page.getByTestId("internal-close-button")).toBeVisible();
  await expect(page.getByTestId("verification-card-expanded")).toContainText("success");
  await page.getByTestId("internal-close-button").click();
  await expect(page.getByTestId("internal-expand-state")).toHaveText("축약 카드");
  await expect(page.locator('[data-mf-card-node="13-05"] [data-card-id]')).toHaveCount(0);
  await expect(page.getByTestId("internal-expand-button")).toBeVisible();
  expect(errors).toEqual([]);
});

test("14 이미지 오류·빈 데이터·카드 클릭 선택 스타일을 처리한다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("14. 이미지·제목·설명 노드", { exact: true }).click();

  await page.getByText("14-01 이미지·제목·설명", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();
  await expect(page.locator('[data-mf-card-node="14-01"] img')).toHaveCount(1);

  await page.getByText("14-02 이미지 오류 처리", { exact: true }).click();
  await expect(page.getByTestId("image-state")).toContainText("대체 이미지 표시");
  await expect(page.getByTestId("fallback-image")).toHaveAttribute("data-fallback", "true");

  await page.getByText("14-03 데이터 없음", { exact: true }).click();
  await expect(page.getByTestId("empty-card-state")).toHaveText("카드 데이터가 없습니다.");
  await expect(page.getByTestId("verification-card-count")).toContainText("현재 0개");

  await page.getByText("14-04 카드 클릭·선택", { exact: true }).click();
  const secondCard = page.locator('[data-card-id="2"]');
  await secondCard.click();
  await expect(secondCard).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("card-selection-state")).toHaveText("카드 2 선택됨");
  await expect(page.getByTestId("verification-selected-card")).toContainText("success");
  await expect(page.getByTestId("verification-event")).toContainText("success");
  expect(errors).toEqual([]);
});

test("15 복합 콘텐츠 트리와 재귀 전체 접기·펼치기가 동작한다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("15. 복합 콘텐츠 트리", { exact: true }).click();

  await page.getByText("15-01 풍부한 루트 노드", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();
  await expect(page.locator('[data-mf-integrated-root="true"]')).toHaveCount(1);
  await page.getByRole("button", { name: "루트 선택", exact: true }).click();
  await expect(page.locator('[data-mf-integrated-root="true"]')).toHaveAttribute("data-expanded", "true");
  await expect(page.locator('[data-mf-integrated-root="true"] [data-card-id]')).toHaveCount(3);

  await page.getByText("15-03 재귀 트리 제어", { exact: true }).click();
  await page.getByRole("button", { name: "전체 접기", exact: true }).click();
  await expect(page.getByTestId("verification-integrated-visible-nodes")).toContainText("현재 1개");
  await expect(page.getByTestId("verification-integrated-visible-links")).toContainText("현재 0개");
  await page.getByRole("button", { name: "전체 펼치기", exact: true }).click();
  await expect(page.getByTestId("verification-integrated-visible-nodes")).toContainText("현재 10개");
  await expect(page.getByTestId("verification-integrated-visible-links")).toContainText("현재 9개");
  expect(errors).toEqual([]);
});

test("16 외부 도구의 중심 이동·줌·화면 맞춤·상세 패널이 동작한다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("16. 외부 도구 패널", { exact: true }).click();

  await page.getByText("16-01 선택 중심 이동", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();
  await page.getByRole("button", { name: "루트 선택", exact: true }).click();
  await page.getByRole("button", { name: "선택 중심 이동", exact: true }).click();
  await expect(page.getByTestId("last-action")).toContainText("선택 중심 이동");

  await page.getByText("16-02 화면 도구", { exact: true }).click();
  await page.getByRole("button", { name: "확대", exact: true }).click();
  await expect(page.getByTestId("zoom-value")).toHaveText("120%");
  await page.getByRole("button", { name: "축소", exact: true }).click();
  await expect(page.getByTestId("zoom-value")).toHaveText("100%");
  await page.getByRole("button", { name: "화면 맞춤", exact: true }).click();

  await page.getByText("16-03 상세 패널", { exact: true }).click();
  await page.getByRole("button", { name: "루트 선택", exact: true }).click();
  await expect(page.getByTestId("detail-panel")).toContainText("MindFusion Studio");
  expect(errors).toEqual([]);
});

test("17 JSON·Mock API의 로딩·오류·데이터 없음 상태가 구분된다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("17. 데이터 연동", { exact: true }).click();

  await page.getByText("17-01 JSON 데이터", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();
  await expect(page.getByTestId("verification-2")).toContainText("현재 10개");

  await page.getByText("17-02 Mock API 로딩", { exact: true }).click();
  await expect(page.getByTestId("loading-state")).toBeVisible();
  await expect(page.getByTestId("data-state")).toHaveText("데이터 준비 완료", { timeout: 3000 });
  await expect(page.getByTestId("verification-data-state")).toContainText("success");

  await page.getByText("17-03 데이터 오류", { exact: true }).click();
  await expect(page.getByTestId("error-state")).toContainText("데이터를 불러오지 못했습니다.");
  await expect(page.getByTestId("verification-data-state")).toContainText("success");

  await page.getByText("17-04 데이터 없음", { exact: true }).click();
  await expect(page.getByTestId("empty-state")).toContainText("표시할 데이터가 없습니다.");
  await expect(page.getByTestId("verification-integration-ready")).toContainText("success");
  expect(errors).toEqual([]);
});

test("18 검색·필터·종합 자동 검증이 실제 visible 상태를 반영한다", async ({ page }) => {
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("18. 실행 검증", { exact: true }).click();

  await page.getByText("18-01 검색", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();
  await page.getByLabel("노드 검색").fill("웹");
  await page.getByRole("button", { name: "검색", exact: true }).click();
  await expect(page.getByTestId("verification-integrated-visible-nodes")).toContainText("현재 3개");
  await expect(page.getByTestId("verification-integrated-visible-links")).toContainText("현재 2개");

  await page.getByText("18-02 필터", { exact: true }).click();
  await page.getByLabel("유형").selectOption("team");
  await expect(page.getByTestId("verification-integrated-visible-nodes")).toContainText("현재 4개");
  await expect(page.getByTestId("verification-integrated-visible-links")).toContainText("현재 3개");

  await page.getByText("18-03 종합 자동 검증", { exact: true }).click();
  await expect(page.getByTestId("integrated-verification")).toContainText("✓ 노드 10개");
  await expect(page.getByTestId("integrated-verification")).toContainText("✓ 연결선 9개");
  await expect(page.getByTestId("verification-integration-ready")).toContainText("success");
  expect(errors).toEqual([]);
});

test("19 최종 종합 예제의 전체 기능을 검증하고 스크린샷을 생성한다", async ({ page }) => {
  test.setTimeout(60_000);
  const errors = collectBrowserErrors(page);
  await page.goto("/");
  await page.getByText("19. 완성 예제", { exact: true }).click();
  await page.getByText("19-01 최종 종합 예제", { exact: true }).click();
  await page.getByRole("tab", { name: "실행 화면" }).click();

  await page.getByRole("button", { name: "루트 선택", exact: true }).click();
  await page.locator('[data-card-id="c2"]').click();
  await expect(page.getByTestId("detail-panel")).toContainText("선택 카드: c2");
  await page.getByRole("button", { name: "전체 접기", exact: true }).click();
  await page.getByRole("button", { name: "전체 펼치기", exact: true }).click();
  await page.getByRole("button", { name: "선택 중심 이동", exact: true }).click();
  await page.getByRole("button", { name: "확대", exact: true }).click();
  await page.getByRole("button", { name: "화면 맞춤", exact: true }).click();
  await page.getByLabel("노드 검색").fill("품질");
  await page.getByRole("button", { name: "검색", exact: true }).click();
  await page.getByLabel("유형").selectOption("all");
  await expect(page.getByTestId("integrated-verification")).toContainText("콘솔 오류 0개");

  await page.screenshot({ path: join(process.cwd(), "output", "final-integrated.png"), fullPage: true });
  expect(errors).toEqual([]);
});
