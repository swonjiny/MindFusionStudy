import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button, Flex, Segmented, Space, Tag, Typography } from "antd";
import {
  CompressOutlined,
  MinusOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Behavior, Diagram } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";
import { lessonByKey } from "../data/lessonMenus";
import { buildLessonDiagram } from "./lessonDefinitions";
import "../styles/diagram.css";

const DiagramLesson = forwardRef(function DiagramLesson(
  { lessonKey, resetToken, onStatus },
  ref,
) {
  const [diagram] = useState(() => new Diagram());
  const viewRef = useRef(null);
  const hostRef = useRef(null);
  const [zoom, setZoom] = useState(100);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [variant, setVariant] = useState("화면 채우기");
  const [nodeMetrics, setNodeMetrics] = useState(null);
  const [eventSummary, setEventSummary] = useState({ count: 0, last: "아직 발생하지 않음", selected: 0 });
  const eventCountRef = useRef(0);
  const lastEventRef = useRef("아직 발생하지 않음");
  const lesson = lessonByKey[lessonKey];

  const report = () => {
    const first = diagram.nodes[0];
    const bounds = first?.bounds;
    const nextMetrics = bounds
      ? {
          x: Math.round(bounds.x),
          y: Math.round(bounds.y),
          width: Math.round(bounds.width),
          height: Math.round(bounds.height),
        }
      : null;
    setNodeMetrics(nextMetrics);
    onStatus({
      diagramReady: Boolean(diagram),
      viewReady: Boolean(viewRef.current?.find()),
      rendered: true,
      nodeCount: diagram.nodes.length,
      linkCount: diagram.links.length,
      selectedNodeId: diagram.selection.nodes[0]?.text || null,
      selectedNodeCount: diagram.selection.nodes.length,
      eventCount: eventCountRef.current,
      lastEvent: lastEventRef.current,
      consoleErrorCount: 0,
    });
  };

  const initialize = () => {
    eventCountRef.current = 0;
    lastEventRef.current = "아직 발생하지 않음";
    setEventSummary({ count: 0, last: "아직 발생하지 않음", selected: 0 });
    buildLessonDiagram(diagram, lessonKey);
    report();
    requestAnimationFrame(() => {
      if (diagram.nodes.length !== lesson.expectedNodes || diagram.links.length !== lesson.expectedLinks) {
        buildLessonDiagram(diagram, lessonKey);
      }
      report();
    });
  };

  const ensureExpectedDiagram = () => {
    if (diagram.nodes.length !== lesson.expectedNodes || diagram.links.length !== lesson.expectedLinks) {
      buildLessonDiagram(diagram, lessonKey);
    }
    report();
  };

  const handleControlLoaded = () => {
    // React StrictMode can dispose and attach the wrapper control once more in
    // development. Rebuilding here makes the model correct after the final attach.
    buildLessonDiagram(diagram, lessonKey);
    report();
    requestAnimationFrame(() => {
      if (diagram.nodes.length !== lesson.expectedNodes || diagram.links.length !== lesson.expectedLinks) {
        buildLessonDiagram(diagram, lessonKey);
      }
      report();
    });
  };

  useEffect(() => {
    initialize();
    return () => diagram.clearAll();
  }, [diagram, lessonKey, resetToken]);

  useEffect(() => {
    if (!hostRef.current) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      });
    });
    observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, []);

  const updateZoom = (next) => {
    const safeZoom = Math.min(160, Math.max(50, next));
    setZoom(safeZoom);
  };

  const fit = () => {
    viewRef.current?.find()?.zoomToFit();
    setZoom(Math.round(viewRef.current?.find()?.zoomFactor || 100));
  };

  const moveNode = () => {
    const node = diagram.nodes[0];
    if (!node) return;
    node.bounds = new Rect(node.bounds.x + 15, node.bounds.y + 10, node.bounds.width, node.bounds.height);
    report();
  };

  const resizeNode = () => {
    const node = diagram.nodes[0];
    if (!node) return;
    node.bounds = new Rect(node.bounds.x, node.bounds.y, node.bounds.width + 12, node.bounds.height + 8);
    report();
  };

  const recordEvent = (label, item) => {
    eventCountRef.current += 1;
    lastEventRef.current = `${label}: ${item?.text || "항목"}`;
    const next = {
      count: eventCountRef.current,
      last: lastEventRef.current,
      selected: diagram.selection.nodes.length,
    };
    setEventSummary(next);
    requestAnimationFrame(report);
  };

  const selectNodes = async (count) => {
    diagram.selection.clear();
    for (const node of diagram.nodes.slice(0, count)) {
      await diagram.selection.addItem(node);
    }
    requestAnimationFrame(report);
  };

  const clearSelection = () => {
    diagram.selection.clear();
    requestAnimationFrame(report);
  };

  const handleSelectionChanged = (_sender, args) => {
    const selected = diagram.selection.nodes.length;
    if (lesson.eventKind === "selection") {
      eventCountRef.current += 1;
      lastEventRef.current = `선택 변경: ${args?.oldItems?.length ?? 0} → ${args?.newItems?.length ?? selected}`;
    }
    setEventSummary({
      count: eventCountRef.current,
      last: lastEventRef.current,
      selected,
    });
    requestAnimationFrame(report);
  };

  useImperativeHandle(ref, () => ({ initialize, report, fit }));

  const isEmpty = lesson.expectedNodes === 0;
  const isGrid = lessonKey === "01-03";
  const fixedSize = lessonKey === "01-02" && variant === "고정 높이";

  return (
    <div className="demo-shell" data-testid="diagram-demo">
      <div className="demo-toolbar">
        <Space wrap size={4}>
          <Button icon={<PlayCircleOutlined />} size="small" onClick={initialize}>
            실행
          </Button>
          <Button icon={<ReloadOutlined />} size="small" onClick={initialize}>
            다시 실행
          </Button>
          <Button size="small" onClick={initialize}>
            초기화
          </Button>
        </Space>
        <Space wrap size={4}>
          <Button aria-label="확대" icon={<PlusOutlined />} size="small" onClick={() => updateZoom(zoom + 10)} />
          <Button aria-label="축소" icon={<MinusOutlined />} size="small" onClick={() => updateZoom(zoom - 10)} />
          <Button size="small" onClick={() => setZoom(100)}>100%</Button>
          <Button icon={<CompressOutlined />} size="small" onClick={fit}>화면 맞춤</Button>
          <Button size="small" type="primary" ghost onClick={report}>검증 실행</Button>
        </Space>
      </div>

      {lessonKey === "01-02" && (
        <Flex className="inline-control" align="center" justify="space-between" wrap gap={8}>
          <Typography.Text strong>크기 방식 비교</Typography.Text>
          <Segmented
            options={["화면 채우기", "고정 높이"]}
            value={variant}
            onChange={setVariant}
          />
        </Flex>
      )}

      {(lessonKey === "02-06" || lessonKey === "02-07") && (
        <Flex className="inline-control" align="center" justify="space-between" wrap gap={8}>
          <Space>
            <Tag color="blue">
              {nodeMetrics
                ? `x ${nodeMetrics.x}, y ${nodeMetrics.y}, w ${nodeMetrics.width}, h ${nodeMetrics.height}`
                : "값 확인 중"}
            </Tag>
          </Space>
          <Button type="primary" onClick={lessonKey === "02-06" ? moveNode : resizeNode}>
            {lessonKey === "02-06" ? "오른쪽 아래로 이동" : "노드 크게 만들기"}
          </Button>
        </Flex>
      )}

      {lesson.category === "04" && (
        <Flex className="inline-control" align="center" justify="space-between" wrap gap={8}>
          <Space wrap>
            <Tag color="blue" data-testid="event-count">이벤트 {eventSummary.count}회</Tag>
            <Tag color="purple" data-testid="selected-count">선택 {eventSummary.selected}개</Tag>
            <Typography.Text data-testid="last-event">{eventSummary.last}</Typography.Text>
          </Space>
          <Space wrap>
            <Button onClick={() => selectNodes(1)}>첫 노드 선택</Button>
            {(lessonKey === "04-03" || lessonKey === "04-04") && (
              <Button type="primary" onClick={() => selectNodes(2)}>두 노드 선택</Button>
            )}
            <Button onClick={clearSelection}>선택 해제</Button>
          </Space>
        </Flex>
      )}

      <div
        ref={hostRef}
        className={`diagram-host ${isGrid ? "diagram-grid" : ""} ${fixedSize ? "fixed-size" : ""}`}
      >
        <DiagramView
          ref={viewRef}
          diagram={diagram}
          behavior={Behavior.Modify}
          zoomFactor={zoom}
          showGrid={isGrid}
          onControlLoaded={handleControlLoaded}
          onDiagramChanged={ensureExpectedDiagram}
          onNodeModified={ensureExpectedDiagram}
          onNodeClicked={(_sender, args) => recordEvent("클릭", args?.node)}
          onNodeDoubleClicked={(_sender, args) => recordEvent("더블 클릭", args?.node)}
          onSelectionChanged={handleSelectionChanged}
        />
        {isEmpty && (
          <div className="diagram-empty-overlay">
            <div className="empty-orbit" aria-hidden="true" />
            <Typography.Title level={4}>
              {lessonKey === "01-03" ? "배경과 격자를 확인하세요" : "빈 Diagram이 준비되었습니다"}
            </Typography.Title>
            <Typography.Text type="secondary">
              노드는 없지만 DiagramView의 canvas가 정상적으로 렌더링됩니다.
            </Typography.Text>
          </div>
        )}
        <Tag className="diagram-size" color="blue">
          {size.width} × {size.height}px · {zoom}%
        </Tag>
      </div>
    </div>
  );
});

export default DiagramLesson;
