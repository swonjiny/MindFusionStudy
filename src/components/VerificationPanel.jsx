import { Button, Card, Divider, Progress, Space, Tag, Typography } from "antd";
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons";

function VerificationRow({ label, detail, passed, testId }) {
  return (
    <div className="verification-row" data-testid={testId}>
      {passed ? (
        <CheckCircleFilled className="status-success" />
      ) : (
        <ExclamationCircleFilled className="status-warning" />
      )}
      <div>
        <Typography.Text strong>{label}</Typography.Text>
        <Typography.Text type="secondary">{detail}</Typography.Text>
      </div>
      <Tag color={passed ? "success" : "warning"}>{passed ? "success" : "pending"}</Tag>
    </div>
  );
}

export default function VerificationPanel({ lesson, status, onReset }) {
  if (lesson.status === "planned") {
    return (
      <aside className="verification-sider" data-testid="verification-panel">
        <Card title="실행 검증">
          <Typography.Text type="secondary">
            준비 중인 단계에는 실행 가능한 검증 항목이 없습니다.
          </Typography.Text>
        </Card>
      </aside>
    );
  }

  const checks = [
    ["Diagram 생성", "Diagram 모델 인스턴스가 준비됩니다.", status.diagramReady, "verification-0"],
    ["DiagramView 표시", "canvas를 포함한 실행 영역이 표시됩니다.", status.viewReady, "verification-1"],
    ["노드 개수", `${lesson.expectedNodes}개가 필요하며 현재 ${status.nodeCount}개입니다.`, status.nodeCount === lesson.expectedNodes, "verification-2"],
    ["연결선 개수", `${lesson.expectedLinks}개가 필요하며 현재 ${status.linkCount}개입니다.`, status.linkCount === lesson.expectedLinks, "verification-3"],
    ["콘솔 오류", `수집된 오류 ${status.consoleErrorCount}개`, status.consoleErrorCount === 0, "verification-4"],
  ];
  if (lesson.requiresSelection) {
    checks.push([
      "노드 선택",
      `현재 선택된 노드 ${status.selectedNodeCount || 0}개`,
      (status.selectedNodeCount || 0) > 0,
      "verification-selection",
    ]);
  }
  if (lesson.eventKind) {
    checks.push([
      "이벤트 수신",
      `${status.lastEvent || "아직 발생하지 않음"} · ${status.eventCount || 0}회`,
      (status.eventCount || 0) > 0,
      "verification-event",
    ]);
  }
  if (lesson.tracksTreeState) {
    checks.push(
      [
        "visible 노드",
        `${lesson.expectedVisibleNodes}개가 필요하며 현재 ${status.visibleNodeCount ?? 0}개입니다.`,
        status.visibleNodeCount === lesson.expectedVisibleNodes,
        "verification-visible-nodes",
      ],
      [
        "visible 연결선",
        `${lesson.expectedVisibleLinks}개가 필요하며 현재 ${status.visibleLinkCount ?? 0}개입니다.`,
        status.visibleLinkCount === lesson.expectedVisibleLinks,
        "verification-visible-links",
      ],
      [
        "펼침 상태",
        `expanded 부모 ${status.expandedNodeCount ?? 0}개`,
        status.expandedNodeCount === lesson.expectedExpandedNodes,
        "verification-expanded",
      ],
    );
  }
  if (lesson.tracksHtmlDom) {
    checks.push(
      [
        "HTML DOM",
        `${lesson.expectedHtmlDom}개가 필요하며 현재 ${status.htmlDomCount ?? 0}개입니다.`,
        status.htmlDomCount === lesson.expectedHtmlDom,
        "verification-html-dom",
      ],
      [
        "버튼 DOM",
        `${lesson.expectedButtons}개가 필요하며 현재 ${status.buttonDomCount ?? 0}개입니다.`,
        status.buttonDomCount === lesson.expectedButtons,
        "verification-button-dom",
      ],
    );
  }
  const passedCount = checks.filter((item) => item[2]).length;

  return (
    <aside className="verification-sider" data-testid="verification-panel">
      <Card
        title="실행 확인"
        extra={<Tag color={passedCount === checks.length ? "success" : "processing"}>{passedCount}/{checks.length}</Tag>}
      >
        <Progress
          percent={Math.round((passedCount / checks.length) * 100)}
          status={passedCount === checks.length ? "success" : "active"}
          size="small"
        />
        <div className="verification-list">
          {checks.map(([label, detail, passed, testId]) => (
            <VerificationRow
              key={label}
              label={label}
              detail={detail}
              passed={passed}
              testId={testId}
            />
          ))}
        </div>
        <Button block type="primary" icon={<ReloadOutlined />} onClick={onReset}>
          예제 다시 실행
        </Button>
      </Card>

      <Card title="수동 확인 항목">
        <Space orientation="vertical">
          <Typography.Text>• 실행 화면이 잘리지 않는지 확인</Typography.Text>
          {lesson.expectedNodes > 0 && <Typography.Text>• 노드를 마우스로 드래그할 수 있는지 확인</Typography.Text>}
          {lesson.expectedLinks > 0 && <Typography.Text>• 연결선 방향과 스타일이 설명과 일치하는지 확인</Typography.Text>}
          {lesson.eventKind && <Typography.Text>• 선택·클릭 이벤트 로그가 즉시 갱신되는지 확인</Typography.Text>}
          {lesson.tracksTreeState && <Typography.Text>• 접기·펼치기 후 노드와 연결선이 함께 표시·숨김되는지 확인</Typography.Text>}
          <Typography.Text>• 텍스트와 색상이 설명과 일치하는지 확인</Typography.Text>
        </Space>
      </Card>

      <Card title="자주 발생하는 오류">
        <Typography.Text strong>부모 높이가 0일 때</Typography.Text>
        <Typography.Paragraph type="secondary">
          DiagramView의 높이는 100%이므로 부모에 명시적 높이가 필요합니다.
        </Typography.Paragraph>
        <Divider />
        <Typography.Text strong>Factory 노드 중복 추가</Typography.Text>
        <Typography.Paragraph type="secondary">
          createShapeNode 반환값은 이미 Diagram에 등록되어 있습니다.
        </Typography.Paragraph>
      </Card>
    </aside>
  );
}
