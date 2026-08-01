/**
 * [프로젝트 구조 안내] 화면 위쪽의 제목, 진행률, 이전·다음 이동, 테마 버튼을 표시합니다.
 * 이 컴포넌트는 전달받은 값만 화면에 표현하는 역할이며 학습 데이터는 직접 변경하지 않습니다.
 * 버튼을 누르면 부모가 전달한 콜백을 호출하므로 실제 메뉴 이동 로직은 App.jsx에서 추적합니다.
 */
import { Button, Flex, Progress, Space, Switch, Typography } from "antd";
import {
  ExpandOutlined,
  LeftOutlined,
  MoonOutlined,
  RightOutlined,
  SunOutlined,
} from "@ant-design/icons";

export default function AppHeader({
  lesson,
  progress,
  onPrevious,
  onNext,
  darkMode,
  onThemeChange,
}) {
  const enterFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-mark" aria-hidden="true">M</div>
        <div>
          <Typography.Title level={4}>MindFusion 학습 가이드</Typography.Title>
          <Typography.Text>단계별 예제로 Diagramming 기능을 학습합니다.</Typography.Text>
        </div>
      </div>
      <Flex className="header-status" align="center" gap={14}>
        <div className="header-progress">
          <Typography.Text>{lesson.key} · {lesson.shortTitle}</Typography.Text>
          <Progress percent={progress} size="small" showInfo={false} />
        </div>
        <Space>
          <Switch
            aria-label="테마 전환"
            checked={darkMode}
            onChange={onThemeChange}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
          <Button icon={<ExpandOutlined />} onClick={enterFullscreen}>전체 화면</Button>
          <Button aria-label="이전 예제" icon={<LeftOutlined />} onClick={onPrevious} disabled={!lesson.previousLessonKey} />
          <Button aria-label="다음 예제" icon={<RightOutlined />} onClick={onNext} disabled={!lesson.nextLessonKey} />
        </Space>
      </Flex>
    </header>
  );
}
