import { expect, test } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

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

test("모든 예제 JSX가 프로젝트 내부 모듈 없이 독립 실행 가능하다", () => {
  const examplesRoot = join(process.cwd(), "src", "examples");
  const files = readdirSync(examplesRoot, { recursive: true })
    .filter((file) => typeof file === "string" && /^0[1-5]-/.test(file) && file.endsWith(".jsx"));

  expect(files).toHaveLength(30);
  for (const file of files) {
    const source = readFileSync(join(examplesRoot, file), "utf8");
    expect(source, file).not.toContain('from "../');
    expect(source, file).not.toContain('from "./');
    expect(source, file).toContain("@mindfusion/diagramming");
    expect(source, file).toContain("@mindfusion/diagramming-react");
    expect(source, file).toContain("export default function");
  }
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

  await page.getByText("06. 부모·자식 트리 구조", { exact: true }).click();
  await page.getByText("06-01 준비 중", { exact: true }).click();
  await expect(page.getByTestId("planned-lesson")).toBeVisible();
  await expect(page.getByText(/2차 구현 범위에는 포함되지 않습니다/)).toBeVisible();

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
