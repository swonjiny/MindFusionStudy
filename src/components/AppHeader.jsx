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
