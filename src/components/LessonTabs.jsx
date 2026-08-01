import { Alert, Card, Col, Descriptions, Empty, Flex, Row, Space, Tabs, Tag, Typography } from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  CompassOutlined,
  DesktopOutlined,
  FileMarkdownOutlined,
  InfoCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import MarkdownViewer from "./MarkdownViewer";
import SourceCodeViewer from "./SourceCodeViewer";
import { lessonRegistry } from "../data/lessonRegistry";

export default function LessonTabs({ lesson, resetToken, onStatus }) {
  const Example = lessonRegistry[lesson.key];

  const overview = (
    <Row gutter={[14, 14]}>
      <Col xs={24} lg={9}>
        <Card title="이번 단계 학습 목표" className="lesson-card">
          <Space orientation="vertical">
            {lesson.goals.map((goal) => <Typography.Text key={goal}>• {goal}</Typography.Text>)}
          </Space>
        </Card>
        <Card title="사용되는 MindFusion 객체" className="lesson-card">
          <Flex wrap gap={8}>{lesson.objects.map((object) => <Tag color="blue" key={object}>{object}</Tag>)}</Flex>
        </Card>
      </Col>
      <Col xs={24} lg={15}>
        <Card title="예상 실행 결과" className="lesson-card">
          <Typography.Paragraph>{lesson.description}</Typography.Paragraph>
          <Descriptions
            size="small"
            column={1}
            items={[
              { key: "nodes", label: "노드 수", children: `${lesson.expectedNodes}개` },
              { key: "links", label: "연결선 수", children: `${lesson.expectedLinks}개` },
              { key: "interaction", label: "상호작용", children: lesson.eventKind ? "선택·이벤트 결과 확인" : lesson.expectedNodes ? "노드 드래그 가능" : "화면 렌더링 확인" },
            ]}
          />
        </Card>
        <Alert
          type="info"
          showIcon
          message="이전 단계에서 추가된 내용"
          description={lesson.previousLessonKey ? `${lesson.previousLessonKey}에서 배운 기반 위에 이번 속성 또는 생성 방식을 추가합니다.` : "첫 단계이므로 Diagram과 DiagramView의 최소 관계부터 시작합니다."}
        />
      </Col>
    </Row>
  );

  const execution = Example ? (
    <Example key={`${lesson.key}-${resetToken}`} resetToken={resetToken} onStatus={onStatus} />
  ) : <Empty description="실행 예제가 없습니다." />;

  const items = [
    { key: "overview", label: "개요", icon: <CompassOutlined />, children: overview },
    {
      key: "details",
      label: "상세 설명",
      icon: <BookOutlined />,
      children: (
        <Card>
          <Typography.Title level={4}>Diagram과 DiagramView의 관계</Typography.Title>
          <Typography.Paragraph>
            Diagram은 노드와 연결선을 보관하는 모델이고 DiagramView는 모델을 canvas에 그려 사용자 입력을 전달하는 React 뷰입니다.
            인스턴스를 상태로 유지하면 렌더링마다 모델이 교체되지 않습니다.
          </Typography.Paragraph>
          <Typography.Title level={4}>StrictMode와 정리</Typography.Title>
          <Typography.Paragraph>
            초기화 전에 clearAll을 호출해 effect가 다시 실행되어도 노드가 중복되지 않게 합니다. React 래퍼는 unmount 시 core view를 dispose하며,
            예제 cleanup은 모델 내용을 비웁니다.
          </Typography.Paragraph>
        </Card>
      ),
    },
    { key: "execution", label: "실행 화면", icon: <DesktopOutlined />, children: execution },
    { key: "source", label: "소스 코드", icon: <CodeOutlined />, children: <SourceCodeViewer lesson={lesson} /> },
    { key: "guide", label: "개발 가이드", icon: <FileMarkdownOutlined />, children: <MarkdownViewer lesson={lesson} /> },
    {
      key: "criteria",
      label: "정상 실행 기준",
      icon: <CheckCircleOutlined />,
      children: (
        <Card>
          <Typography.Title level={4}>자동 검증 기준</Typography.Title>
          <Space orientation="vertical">
            <Typography.Text>• Diagram과 DiagramView가 생성되어야 합니다.</Typography.Text>
            <Typography.Text>• 노드 수가 정확히 {lesson.expectedNodes}개여야 합니다.</Typography.Text>
            <Typography.Text>• 연결선 수가 정확히 {lesson.expectedLinks}개여야 합니다.</Typography.Text>
              {lesson.eventKind && <Typography.Text>• 선택 또는 이벤트 결과가 검증 패널에 반영되어야 합니다.</Typography.Text>}
              {lesson.tracksTreeState && <Typography.Text>• visible 노드·연결선 수와 expanded 부모 수가 단계 기준과 일치해야 합니다.</Typography.Text>}
            <Typography.Text>• 콘솔 오류 수가 0이어야 합니다.</Typography.Text>
          </Space>
        </Card>
      ),
    },
    {
      key: "troubleshooting",
      label: "문제 해결",
      icon: <ToolOutlined />,
      children: (
        <Card>
          <Alert
            showIcon
            type="warning"
            message="화면이 보이지 않을 때"
            description="DiagramView의 부모 높이, 패키지 CSS 충돌, 브라우저 콘솔 오류를 순서대로 확인하세요."
          />
          <Alert
            className="stacked-alert"
            showIcon
            type="info"
            message="노드 수가 예상보다 많을 때"
            description="초기화 전에 clearAll을 호출했는지, Factory 반환 노드를 addItem으로 다시 추가하지 않았는지 확인하세요."
          />
        </Card>
      ),
    },
    {
      key: "next",
      label: "다음 단계",
      icon: <InfoCircleOutlined />,
      children: (
        <Card>
          <Typography.Title level={4}>다음 단계 안내</Typography.Title>
          <Typography.Paragraph>
            {lesson.nextLessonKey
              ? `${lesson.nextLessonKey} 예제에서 현재 개념에 다음 속성 또는 생성 방식을 추가합니다.`
              : "이번 3차 구현 범위의 마지막 예제입니다. 09 이후 단계는 아직 구현하지 않습니다."}
          </Typography.Paragraph>
        </Card>
      ),
    },
  ];

  return <Tabs className="lesson-tabs" defaultActiveKey="execution" items={items} />;
}
