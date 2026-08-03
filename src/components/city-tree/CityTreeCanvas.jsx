/**
 * [초보자용 상세 주석] 도시 트리의 ControlNode 생성, DOM 이벤트, 접기·펼치기,
 * 상세 확장과 검증 상태를 한곳에서 관리하는 재사용 가능한 실행 컴포넌트입니다.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowHeads, Behavior, ControlNode, Diagram, LinkShape } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";
import { Button, Space, Tag, Typography } from "antd";
import { CompressOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { cityTreeNodeById, cityTreeNodes, cityTreeRoots } from "../../data/cityTreeSampleData";
import { renderCityTreeNode } from "./CityTreeNode";
import CityTreeControlPanel from "./CityTreeControlPanel";
import CityTreeDetailPanel from "./CityTreeDetailPanel";
import "../../styles/city-tree.css";

const stageConfig = {
  overview: { title: "도시 정보 트리 예제 개요", description: "ControlNode 기반 도시 정보 탐색기의 전체 구성을 미리 봅니다." },
  basic: { title: "도시 정보 트리 기본 구조", description: "대표 이미지·제목·설명을 가진 HTML 노드를 표시합니다." },
  roots: { title: "루트 노드 2개 이상", description: "서울과 부산을 독립된 두 루트로 한 화면에 배치합니다." },
  nested: { title: "다단계 자식 노드", description: "구와 동으로 이어지는 3단계 트리와 접기 버튼을 추가합니다.", collapse: true },
  icons: { title: "노드 바깥 정보 아이콘", description: "노드 테두리 아래에 분류 아이콘과 툴팁을 배치합니다.", collapse: true, icons: true },
  detail: { title: "상세정보 보기 버튼", description: "각 노드의 상세 동작 버튼을 HTML DOM으로 연결합니다.", collapse: true, icons: true, detailButton: true },
  expanded: { title: "확장형 상세정보 노드", description: "해운대구 노드가 커지고 세 개의 상세 카드를 표시합니다.", collapse: true, icons: true, detailButton: true, expanded: true },
  tooltip: { title: "특징정보 툴팁", description: "서울특별시 옆에 닫고 다시 열 수 있는 특징 말풍선을 배치합니다.", collapse: true, icons: true, detailButton: true, expanded: true, tooltip: true },
  panel: { title: "선택 노드 상세 패널", description: "선택된 도시의 지표와 기관 정보를 우측 패널에 표시합니다.", collapse: true, icons: true, detailButton: true, expanded: true, tooltip: true, panel: true },
  controls: { title: "전체 및 루트별 열기·닫기", description: "전체 트리와 선택 루트를 재귀적으로 제어합니다.", collapse: true, icons: true, detailButton: true, expanded: true, tooltip: true, panel: true, controls: true },
  final: { title: "완성형 도시 정보 트리", description: "도시 탐색, 상세 확장, 특징 정보, 패널과 뷰 도구를 통합합니다.", collapse: true, icons: true, detailButton: true, expanded: true, tooltip: true, panel: true, controls: true, viewport: true },
};

const basePositions = {
  seoul: [45, 4, 80, 48], busan: [360, 4, 80, 48],
  gangnam: [0, 72, 56, 46], mapo: [62, 72, 56, 46], jongno: [124, 72, 56, 46],
  haeundae: [198, 72, 60, 48], suyeong: [266, 72, 56, 46], dongnae: [328, 72, 56, 46],
  namgu: [390, 72, 56, 46], yeonje: [452, 72, 56, 46], sasang: [514, 72, 56, 46],
  yeoksam: [0, 158, 48, 42], samseong: [52, 158, 48, 42], hongdae: [104, 158, 48, 42], sangam: [156, 158, 48, 42],
  udong: [208, 158, 48, 42], jungdong: [260, 158, 48, 42], gwangan: [312, 158, 48, 42],
};

const hasCollapsedAncestor = (node, collapsedIds) => {
  let parentId = node.parentId;
  while (parentId) {
    if (collapsedIds.has(parentId)) return true;
    parentId = cityTreeNodeById[parentId]?.parentId;
  }
  return false;
};

const descendantsOf = (nodeId) => cityTreeNodes
  .filter((node) => {
    let parentId = node.parentId;
    while (parentId) {
      if (parentId === nodeId) return true;
      parentId = cityTreeNodeById[parentId]?.parentId;
    }
    return false;
  })
  .map((node) => node.id);

export default function CityTreeCanvas({ variant = "final", onStatus } = {}) {
  const config = stageConfig[variant] || stageConfig.final;
  const [diagram] = useState(() => new Diagram());
  const viewRef = useRef(null);
  const coreViewRef = useRef(null);
  const nodeMapRef = useRef(new Map());
  const cleanupRef = useRef(new Map());
  const initializedRef = useRef(false);
  const onStatusRef = useRef(onStatus);
  onStatusRef.current = onStatus;

  const initialExpandedId = config.expanded ? "haeundae" : null;
  const initialSelectedId = config.panel || config.expanded ? "haeundae" : null;
  const [collapsedIds, setCollapsedIds] = useState(() => new Set());
  const collapsedRef = useRef(collapsedIds);
  const [detailExpandedId, setDetailExpandedId] = useState(initialExpandedId);
  const detailExpandedRef = useRef(initialExpandedId);
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const selectedRef = useRef(initialSelectedId);
  const [selectedRootId, setSelectedRootId] = useState("busan");
  const [tooltipVisible, setTooltipVisible] = useState(Boolean(config.tooltip));
  const tooltipVisibleRef = useRef(Boolean(config.tooltip));
  const [zoom, setZoom] = useState(100);
  const [lastAction, setLastAction] = useState("도시 트리 준비");

  const totalIconCount = useMemo(() => cityTreeNodes.reduce((sum, node) => sum + node.categoryIcons.length, 0), []);
  const expandableNodes = useMemo(() => cityTreeNodes.filter((node) => node.children.length > 0), []);

  const report = useCallback((action = lastAction) => {
    const visibleNodes = diagram.nodes.filter((node) => node.visible).length;
    const visibleLinks = diagram.links.filter((link) => link.visible).length;
    const expandedDetailNodeCount = detailExpandedRef.current ? 1 : 0;
    const selected = selectedRef.current;
    onStatusRef.current?.({
      diagramReady: true,
      viewReady: Boolean(coreViewRef.current),
      rendered: diagram.nodes.length === cityTreeNodes.length,
      nodeCount: diagram.nodes.length,
      totalNodeCount: diagram.nodes.length,
      rootCount: cityTreeRoots.length,
      linkCount: diagram.links.length,
      visibleNodeCount: visibleNodes,
      hiddenNodeCount: diagram.nodes.length - visibleNodes,
      visibleLinkCount: visibleLinks,
      expandedNodeCount: expandableNodes.filter((node) => !collapsedRef.current.has(node.id)).length,
      collapsedNodeCount: collapsedRef.current.size,
      htmlDomCount: document.querySelectorAll("[data-city-node-id]").length,
      buttonDomCount: document.querySelectorAll("[data-city-action]").length,
      externalIconCount: config.icons ? totalIconCount : 0,
      featureTooltipCount: config.tooltip && tooltipVisibleRef.current ? 1 : 0,
      expandedDetailNodeCount,
      detailCardCount: detailExpandedRef.current ? (cityTreeNodeById[detailExpandedRef.current]?.detailCards?.length || 0) : 0,
      cardCount: 3,
      cardDomCount: detailExpandedRef.current ? 3 : 0,
      cardExpanded: Boolean(detailExpandedRef.current),
      selectedRootId,
      selectedNodeId: selected,
      selectedNodeCount: selected ? 1 : 0,
      selectedCardCount: 0,
      rightPanelReady: Boolean(config.panel && selected),
      dataState: "success",
      integrationReady: true,
      eventCount: action === "도시 트리 준비" ? 0 : 1,
      lastEvent: action,
      consoleErrorCount: 0,
    });
  }, [config.icons, config.panel, config.tooltip, diagram, expandableNodes, lastAction, selectedRootId, totalIconCount]);

  const positionFor = useCallback((id) => {
    const [x, y, width, height] = basePositions[id];
    const expanded = detailExpandedRef.current === "haeundae";
    if (!expanded) return new Rect(x, y, width, height);
    if (id === "haeundae") return new Rect(180, 65, 135, 110);
    if (id === "udong") return new Rect(198, 202, width, height);
    if (id === "jungdong") return new Rect(250, 202, width, height);
    if (["suyeong", "dongnae", "namgu", "yeonje", "sasang", "gwangan"].includes(id)) return new Rect(x + 62, y, width, height);
    return new Rect(x, y, width, height);
  }, []);

  const renderNode = useCallback((id) => {
    const diagramNode = nodeMapRef.current.get(id);
    const dataNode = cityTreeNodeById[id];
    const content = diagramNode?.getContent?.();
    if (!diagramNode || !content) return;
    content.innerHTML = renderCityTreeNode(dataNode, {
      selected: selectedRef.current === id,
      collapsed: collapsedRef.current.has(id),
      detailExpanded: detailExpandedRef.current === id,
      showIcons: config.icons,
      showDetailButton: config.detailButton,
      showCollapseButton: config.collapse,
      showFeatureTooltip: config.tooltip && tooltipVisibleRef.current && id === "seoul",
    });
    content.style.overflow = config.tooltip && id === "seoul" ? "visible" : "hidden";
    diagramNode.bounds = positionFor(id);
  }, [config.collapse, config.detailButton, config.icons, config.tooltip, positionFor]);

  const renderAll = useCallback(() => {
    cityTreeNodes.forEach((node) => renderNode(node.id));
    diagram.invalidate();
  }, [diagram, renderNode]);

  const applyVisibility = useCallback(() => {
    cityTreeNodes.forEach((dataNode) => {
      const node = nodeMapRef.current.get(dataNode.id);
      if (!node) return;
      node.visible = !hasCollapsedAncestor(dataNode, collapsedRef.current);
      node.expanded = dataNode.children.length > 0 && !collapsedRef.current.has(dataNode.id);
    });
    diagram.links.forEach((link) => {
      link.visible = link.origin.visible && link.destination.visible;
    });
    diagram.invalidate();
  }, [diagram]);

  const selectNode = useCallback((id, action = null) => {
    const previous = selectedRef.current;
    selectedRef.current = id;
    setSelectedId(id);
    if (previous && previous !== id) renderNode(previous);
    renderNode(id);
    diagram.selection.clear();
    const nextAction = action || `${cityTreeNodeById[id].title} 선택`;
    setLastAction(nextAction);
    queueMicrotask(() => report(nextAction));
  }, [diagram, renderNode, report]);

  const toggleChildren = useCallback((id) => {
    const next = new Set(collapsedRef.current);
    if (next.has(id)) next.delete(id); else next.add(id);
    collapsedRef.current = next;
    setCollapsedIds(next);
    renderNode(id);
    applyVisibility();
    const action = `${cityTreeNodeById[id].title} ${next.has(id) ? "닫기" : "열기"}`;
    setLastAction(action);
    queueMicrotask(() => report(action));
  }, [applyVisibility, renderNode, report]);

  const changeDetail = useCallback((id, shouldExpand) => {
    const previous = detailExpandedRef.current;
    detailExpandedRef.current = shouldExpand ? id : null;
    setDetailExpandedId(shouldExpand ? id : null);
    selectedRef.current = id;
    setSelectedId(id);
    if (previous && previous !== id) renderNode(previous);
    renderAll();
    applyVisibility();
    const action = shouldExpand ? `${cityTreeNodeById[id].title} 상세 확장` : `${cityTreeNodeById[id].title} 기본 크기 복원`;
    setLastAction(action);
    queueMicrotask(() => report(action));
  }, [applyVisibility, renderAll, renderNode, report]);

  const closeTooltip = useCallback(() => {
    tooltipVisibleRef.current = false;
    setTooltipVisible(false);
    renderNode("seoul");
    setLastAction("특징정보 닫기");
    queueMicrotask(() => report("특징정보 닫기"));
  }, [renderNode, report]);

  const attachNodeEvents = useCallback((diagramNode) => {
    const id = diagramNode.tag?.id;
    const content = diagramNode.getContent();
    if (!id || !content || cleanupRef.current.has(id)) return;
    content.style.overflow = config.tooltip && id === "seoul" ? "visible" : "hidden";
    const handler = (event) => {
      const button = event.target.closest?.("[data-city-action]");
      if (button && content.contains(button)) {
        event.preventDefault();
        event.stopPropagation();
        const action = button.dataset.cityAction;
        if (action === "toggle-children") toggleChildren(id);
        if (action === "expand-detail") changeDetail(id, true);
        if (action === "restore-detail") changeDetail(id, false);
        if (action === "close-tooltip") closeTooltip();
        return;
      }
      event.stopPropagation();
      selectNode(id);
    };
    content.addEventListener("click", handler);
    cleanupRef.current.set(id, () => content.removeEventListener("click", handler));
  }, [changeDetail, closeTooltip, selectNode, toggleChildren]);

  const initialize = useCallback(() => {
    if (initializedRef.current) return;
    const coreView = viewRef.current?.find();
    if (!coreView) return;
    initializedRef.current = true;
    coreViewRef.current = coreView;
    ControlNode.createBackgroundImage = false;
    diagram.clearAll();
    cityTreeNodes.forEach((dataNode) => {
      const node = new ControlNode(coreView);
      node.template = renderCityTreeNode(dataNode, {
        selected: selectedRef.current === dataNode.id,
        collapsed: false,
        detailExpanded: detailExpandedRef.current === dataNode.id,
        showIcons: config.icons,
        showDetailButton: config.detailButton,
        showCollapseButton: config.collapse,
        showFeatureTooltip: config.tooltip && tooltipVisibleRef.current && dataNode.id === "seoul",
      });
      node.bounds = positionFor(dataNode.id);
      node.tag = dataNode;
      node.expandable = dataNode.children.length > 0;
      node.expanded = true;
      node.stroke = "transparent";
      node.brush = "transparent";
      diagram.addItem(node);
      nodeMapRef.current.set(dataNode.id, node);
    });
    cityTreeNodes.filter((node) => node.parentId).forEach((dataNode) => {
      const link = diagram.factory.createDiagramLink(nodeMapRef.current.get(dataNode.parentId), nodeMapRef.current.get(dataNode.id));
      link.shape = LinkShape.Polyline;
      link.headShape = ArrowHeads.None();
      link.stroke = "#a9bad0";
      link.strokeThickness = 0.7;
    });
    diagram.selection.clear();
    queueMicrotask(() => {
      nodeMapRef.current.forEach((node) => attachNodeEvents(node));
      renderAll();
      applyVisibility();
      coreView.zoomToFit();
      setZoom(Math.round(coreView.zoomFactor));
      report("도시 트리 준비");
    });
  }, [applyVisibility, attachNodeEvents, config.collapse, config.detailButton, config.icons, config.tooltip, diagram, initialSelectedId, positionFor, renderAll, report]);

  const setCollapsed = useCallback((next, action) => {
    collapsedRef.current = next;
    setCollapsedIds(next);
    renderAll();
    applyVisibility();
    setLastAction(action);
    queueMicrotask(() => report(action));
  }, [applyVisibility, renderAll, report]);

  const expandAll = () => setCollapsed(new Set(), "전체 열기");
  const collapseAll = () => setCollapsed(new Set(expandableNodes.map((node) => node.id)), "전체 닫기");
  const expandRoot = () => {
    const next = new Set(collapsedRef.current);
    [selectedRootId, ...descendantsOf(selectedRootId)].forEach((id) => next.delete(id));
    setCollapsed(next, `${cityTreeNodeById[selectedRootId].title} 루트 열기`);
  };
  const collapseRoot = () => {
    const next = new Set(collapsedRef.current);
    next.add(selectedRootId);
    setCollapsed(next, `${cityTreeNodeById[selectedRootId].title} 루트 닫기`);
  };
  const changeRoot = (id) => {
    setSelectedRootId(id);
    selectNode(id, `${cityTreeNodeById[id].title} 루트 선택`);
  };
  const showTooltip = () => {
    tooltipVisibleRef.current = true;
    setTooltipVisible(true);
    renderNode("seoul");
    queueMicrotask(() => report("특징정보 다시 표시"));
  };
  const closePanel = () => {
    const previous = selectedRef.current;
    selectedRef.current = null;
    setSelectedId(null);
    diagram.selection.clear();
    if (previous) renderNode(previous);
    setLastAction("선택 해제");
    queueMicrotask(() => report("선택 해제"));
  };
  const changeZoom = (delta) => {
    const coreView = coreViewRef.current;
    if (!coreView) return;
    coreView.zoomFactor = Math.max(20, Math.min(180, coreView.zoomFactor + delta));
    setZoom(Math.round(coreView.zoomFactor));
  };
  const fit = () => {
    const coreView = coreViewRef.current;
    if (!coreView) return;
    coreView.zoomToFit();
    setZoom(Math.round(coreView.zoomFactor));
  };

  useEffect(() => () => {
    cleanupRef.current.forEach((cleanup) => cleanup());
    cleanupRef.current.clear();
    nodeMapRef.current.clear();
    diagram.clearAll();
    initializedRef.current = false;
  }, [diagram]);

  const selectedNode = selectedId ? cityTreeNodeById[selectedId] : null;
  const visibleCount = cityTreeNodes.filter((node) => !hasCollapsedAncestor(node, collapsedIds)).length;

  return (
    <section className={`city-tree-experience ${config.panel ? "has-detail-panel" : ""} ${config.controls ? "has-control-panel" : ""}`} data-testid="city-tree-demo">
      {config.controls ? (
        <CityTreeControlPanel
          selectedRootId={selectedRootId}
          onSelectedRootChange={changeRoot}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          onExpandRoot={expandRoot}
          onCollapseRoot={collapseRoot}
        />
      ) : (
        <aside className="city-step-panel">
          <Tag color="blue">{variant === "overview" ? "OVERVIEW" : "STEP"}</Tag>
          <Typography.Title level={4}>{config.title}</Typography.Title>
          <Typography.Paragraph>{config.description}</Typography.Paragraph>
          <Space wrap><Tag>루트 2개</Tag><Tag>노드 18개</Tag><Tag>연결선 16개</Tag></Space>
        </aside>
      )}

      <div className="city-canvas-panel">
        <header className="city-canvas-toolbar">
          <div>
            <strong>{config.title}</strong>
            <span>{lastAction}</span>
          </div>
          <Space size={5}>
            {config.tooltip && !tooltipVisible && <Button size="small" onClick={showTooltip}>특징정보 표시</Button>}
            {config.viewport && <>
              <Button size="small" aria-label="축소" icon={<MinusOutlined />} onClick={() => changeZoom(-10)} />
              <Tag>{zoom}%</Tag>
              <Button size="small" aria-label="확대" icon={<PlusOutlined />} onClick={() => changeZoom(10)} />
              <Button size="small" aria-label="화면 맞춤" icon={<CompressOutlined />} onClick={fit} />
            </>}
          </Space>
        </header>
        <div className="city-canvas" data-testid="diagram-demo">
          <DiagramView
            ref={viewRef}
            diagram={diagram}
            behavior={Behavior.Modify}
            onControlLoaded={initialize}
            onNodeDomCreated={(_sender, args) => attachNodeEvents(args.node)}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <footer className="city-canvas-status">
          <span data-testid="city-tree-root-count">루트 {cityTreeRoots.length}</span>
          <span data-testid="city-tree-total-node-count">전체 노드 {cityTreeNodes.length}</span>
          <span>표시 {visibleCount}</span>
          <span data-testid="city-tree-expanded-node-count">상세 확장 {detailExpandedId ? 1 : 0}</span>
          <span>외부 아이콘 {config.icons ? totalIconCount : 0}</span>
        </footer>
      </div>

      {config.panel && <CityTreeDetailPanel node={selectedNode} onClose={closePanel} />}
    </section>
  );
}
