/**
 * [프로젝트 구조 안내] 개요, 상세 설명, 실행 화면, 소스 코드 등 학습 탭을 조립합니다.
 * 실제 예제 컴포넌트는 lessonRegistry에서 선택되며, 실행 결과는 onStatus를 통해 App으로 올라갑니다.
 * 탭마다 데이터를 새로 만들지 않고 동일한 lesson을 전달해야 제목·문서·검증 기준이 일치합니다.
 */
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
import { getBeginnerLessonContent } from "../data/beginnerGuideContent";

export default function LessonTabs({ lesson, resetToken, onStatus }) {
  const Example = lessonRegistry[lesson.key];
  const beginner = getBeginnerLessonContent(lesson);

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
          title="이전 단계에서 추가된 내용"
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
        <Space orientation="vertical" size={14} style={{ width: "100%" }}>
          <Alert
            showIcon
            type="info"
            title={`${lesson.key}를 한 문장으로 이해하기`}
            description={lesson.description}
          />
          <Card title="먼저 큰 그림부터 이해하기">
            <Typography.Paragraph>{beginner.analogy}</Typography.Paragraph>
            <Typography.Title level={5}>왜 이 기능을 배우나요?</Typography.Title>
            <Typography.Paragraph>{beginner.why}</Typography.Paragraph>
          </Card>
          <Card title="코드는 이 순서로 실행됩니다">
            <ol className="beginner-step-list">
              {beginner.flow.map((step) => <li key={step}><Typography.Text>{step}</Typography.Text></li>)}
            </ol>
            <Alert
              type="success"
              showIcon
              title="외우기보다 흐름을 찾으세요"
              description="모델 준비 → 항목 생성 → 속성·이벤트 적용 → 결과 확인 순서로 읽으면 긴 코드도 쉽게 나눠 볼 수 있습니다."
            />
          </Card>
          <Card title="코드에서 찾을 핵심 용어">
            <Descriptions
              bordered
              size="small"
              column={1}
              items={beginner.objects.map(({ name, description }) => ({
                key: name,
                label: <Typography.Text code>{name}</Typography.Text>,
                children: description,
              }))}
            />
          </Card>
          <Card title="초보자가 자주 막히는 부분">
            <Alert showIcon type="warning" title={beginner.mistake} />
            <Typography.Paragraph style={{ marginTop: 12, marginBottom: 0 }}>
              화면이 비어 있으면 DiagramView 부모 높이와 브라우저 콘솔을 먼저 확인하고,
              노드가 중복되면 초기화 함수가 두 번 실행되었는지 확인하세요.
            </Typography.Paragraph>
          </Card>
        </Space>
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
              {lesson.tracksHtmlDom && <Typography.Text>• 실제 HTML DOM과 버튼 수가 단계 기준과 일치해야 합니다.</Typography.Text>}
              {lesson.tracksCardState && <Typography.Text>• 카드 데이터·DOM·선택·확장 상태가 단계 기준과 일치해야 합니다.</Typography.Text>}
              {lesson.tracksIntegrated && <Typography.Text>• 데이터 상태, visible 트리와 통합 준비 상태가 일치해야 합니다.</Typography.Text>}
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
            title="화면이 보이지 않을 때"
            description="DiagramView의 부모 높이, 패키지 CSS 충돌, 브라우저 콘솔 오류를 순서대로 확인하세요."
          />
          <Alert
            className="stacked-alert"
            showIcon
            type="info"
            title="노드 수가 예상보다 많을 때"
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
              : "전체 01~19 학습 경로의 마지막 종합 예제입니다."}
          </Typography.Paragraph>
        </Card>
      ),
    },
  ];

  return <Tabs className="lesson-tabs" defaultActiveKey="execution" items={items} />;
}
