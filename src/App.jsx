import { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Button, ConfigProvider, Flex, Tag, Typography, theme } from "antd";
import { LeftOutlined, ReloadOutlined, RightOutlined } from "@ant-design/icons";
import AppHeader from "./components/AppHeader";
import AppSidebar from "./components/AppSidebar";
import LessonTabs from "./components/LessonTabs";
import PlannedLesson from "./components/PlannedLesson";
import VerificationPanel from "./components/VerificationPanel";
import { categories, lessonByKey, readyLessons } from "./data/lessonMenus";
import "./styles/layout.css";
import "./styles/lesson.css";
import "./styles/code.css";
import "./styles/markdown.css";

const emptyStatus = {
  diagramReady: false,
  viewReady: false,
  rendered: false,
  nodeCount: 0,
  linkCount: 0,
  selectedNodeId: null,
  selectedNodeCount: 0,
  eventCount: 0,
  lastEvent: "아직 발생하지 않음",
  visibleNodeCount: 0,
  visibleLinkCount: 0,
  expandedNodeCount: 0,
  htmlDomCount: 0,
  buttonDomCount: 0,
  cardCount: 0,
  cardDomCount: 0,
  cardExpanded: false,
  selectedCardCount: 0,
  imageFallbackCount: 0,
  emptyDataVisible: false,
  consoleErrorCount: 0,
};

export default function App() {
  const [selectedKey, setSelectedKey] = useState("02-01");
  const [resetToken, setResetToken] = useState(0);
  const [status, setStatus] = useState(emptyStatus);
  const [darkMode, setDarkMode] = useState(false);
  const [consoleErrorCount, setConsoleErrorCount] = useState(0);
  const lesson = lessonByKey[selectedKey] || lessonByKey["02-01"];

  useEffect(() => {
    const onError = () => {
      setConsoleErrorCount((count) => count + 1);
      setStatus((current) => ({
        ...current,
        consoleErrorCount: current.consoleErrorCount + 1,
      }));
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onError);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onError);
    };
  }, []);

  const progress = useMemo(() => {
    const index = readyLessons.findIndex((item) => item.key === lesson.key);
    return index < 0 ? 0 : Math.round(((index + 1) / readyLessons.length) * 100);
  }, [lesson.key]);

  const navigate = (key) => {
    if (!key) return;
    setStatus({ ...emptyStatus, consoleErrorCount });
    setSelectedKey(key);
    setResetToken(0);
  };

  const reset = () => {
    setStatus({ ...emptyStatus, consoleErrorCount });
    setResetToken((token) => token + 1);
  };

  const updateStatus = (nextStatus) => {
    setStatus({ ...nextStatus, consoleErrorCount });
  };

  const title = lesson.status === "ready" ? lesson.title : lesson.title.replace(" 준비 중", "");
  const categoryTitle = categories.find((category) => category.key === lesson.category)?.title || "학습 메뉴";

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: "#2468d6" },
      }}
    >
      <div className={`app-root ${darkMode ? "dark" : ""}`}>
        <AppHeader
          lesson={lesson}
          progress={progress}
          onPrevious={() => navigate(lesson.previousLessonKey)}
          onNext={() => navigate(lesson.nextLessonKey)}
          darkMode={darkMode}
          onThemeChange={setDarkMode}
        />
        <div className="app-body">
          <AppSidebar selectedKey={selectedKey} onSelect={navigate} progress={progress} />
          <main className="app-content">
            <div className="lesson-heading">
              <Breadcrumb
                items={[
                  { title: `${lesson.category}. ${categoryTitle}` },
                  { title: lesson.key },
                ]}
              />
              <Flex align="center" gap={10} wrap>
                <Tag color="blue" className="lesson-number">{lesson.key}</Tag>
                <Typography.Title level={2}>{title}</Typography.Title>
                <Tag color={lesson.status === "ready" ? "green" : "default"}>
                  {lesson.status === "ready" ? "초급" : "준비 중"}
                </Tag>
              </Flex>
              <Typography.Paragraph>{lesson.description}</Typography.Paragraph>
              {lesson.status === "ready" && (
                <Flex className="lesson-actions" justify="space-between" wrap gap={8}>
                  <Button icon={<LeftOutlined />} disabled={!lesson.previousLessonKey} onClick={() => navigate(lesson.previousLessonKey)}>
                    이전 예제
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={reset}>예제 다시 실행</Button>
                  <Button type="primary" onClick={() => navigate(lesson.nextLessonKey)} disabled={!lesson.nextLessonKey}>
                    다음 예제 <RightOutlined />
                  </Button>
                </Flex>
              )}
            </div>
            {lesson.status === "ready" ? (
              <LessonTabs lesson={lesson} resetToken={resetToken} onStatus={updateStatus} />
            ) : (
              <PlannedLesson lesson={lesson} onBack={() => navigate("02-01")} />
            )}
          </main>
          <VerificationPanel lesson={lesson} status={status} onReset={reset} />
        </div>
      </div>
    </ConfigProvider>
  );
}
