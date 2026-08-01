import { useCallback, useEffect, useRef, useState } from "react";
import { ControlNode, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { Rect } from "@mindfusion/drawing";
import { integratedMockData, loadIntegratedData } from "./integratedData";
import { cardBounds, rootNodeHtml } from "./integratedTemplates";

export function useIntegratedDiagram({ dataMode = "success", includeTree = true, onStatus } = {}) {
  const [diagram] = useState(() => new Diagram());
  const viewRef = useRef(null); const coreViewRef = useRef(null); const rootRef = useRef(null); const nodesRef = useRef(new Map()); const listenersRef = useRef([]); const builtRef = useRef(false); const onStatusRef = useRef(onStatus); onStatusRef.current = onStatus;
  const [dataState, setDataState] = useState(dataMode === "json" ? "success" : "loading");
  const [data, setData] = useState(dataMode === "json" ? structuredClone(integratedMockData) : null);
  const [error, setError] = useState(""); const [selected, setSelected] = useState(null); const [expanded, setExpanded] = useState(false); const [selectedCard, setSelectedCard] = useState(null); const [zoom, setZoom] = useState(100); const [query, setQuery] = useState(""); const [filter, setFilter] = useState("all"); const [lastAction, setLastAction] = useState("초기화"); const eventCount = useRef(0);

  const emit = useCallback((overrides = {}) => {
    const rootDom = document.querySelector('[data-mf-integrated-root="true"]');
    onStatusRef.current?.({ diagramReady: true, viewReady: Boolean(coreViewRef.current), rendered: dataState !== "loading", nodeCount: diagram.nodes.length, linkCount: diagram.links.length, visibleNodeCount: diagram.nodes.filter((node) => node.visible).length, visibleLinkCount: diagram.links.filter((link) => link.visible).length, expandedNodeCount: diagram.nodes.filter((node) => node.expandable && node.expanded).length, htmlDomCount: rootDom ? 1 : 0, buttonDomCount: rootDom?.querySelectorAll("button").length || 0, cardCount: data?.root?.cards?.length || 0, cardDomCount: rootDom?.querySelectorAll("[data-card-id]").length || 0, selectedNodeCount: diagram.selection.nodes.length, cardExpanded: rootDom?.dataset.expanded === "true", selectedCardCount: rootDom?.querySelectorAll('[aria-pressed="true"]').length || 0, eventCount: eventCount.current, lastEvent: lastAction, dataState, integrationReady: dataState === "success" && diagram.nodes.length > 0, consoleErrorCount: 0, ...overrides });
  }, [data, dataState, diagram, lastAction]);

  useEffect(() => {
    if (dataMode === "json") return;
    setDataState("loading");
    loadIntegratedData(dataMode, dataMode === "loading" ? 800 : 260).then((result) => { setData(result); setDataState(result.root ? "success" : "empty"); }).catch((reason) => { setError(reason.message); setDataState("error"); });
  }, [dataMode]);

  const attachCardEvents = useCallback(() => {
    const content = rootRef.current?.getContent?.(); if (!content || content.dataset.integratedEvents === "true") return;
    const click = (event) => { const card = event.target.closest?.("[data-card-id]"); if (!card || !content.contains(card)) return; content.querySelectorAll("[data-card-id]").forEach((item) => { item.style.borderColor = "transparent"; item.style.background = "#fff"; item.setAttribute("aria-pressed", "false"); }); card.style.borderColor = "#2468d6"; card.style.background = "#dcecff"; card.setAttribute("aria-pressed", "true"); eventCount.current += 1; setSelectedCard(card.dataset.cardId); setLastAction(`카드 선택: ${card.dataset.cardId}`); queueMicrotask(() => emit({ selectedCardCount: 1, eventCount: eventCount.current, lastEvent: `카드 선택: ${card.dataset.cardId}` })); };
    content.addEventListener("click", click); content.dataset.integratedEvents = "true"; listenersRef.current.push(() => content.removeEventListener("click", click));
  }, [emit]);

  const applyRootState = useCallback((isExpanded) => {
    const node = rootRef.current; const content = node?.getContent?.(); if (!node || !content || !data?.root) return;
    content.innerHTML = rootNodeHtml(data.root, isExpanded); const size = cardBounds(data.root.cards.length, isExpanded); node.bounds = new Rect(node.bounds.x, node.bounds.y, size.width, size.height); diagram.invalidate(); setExpanded(isExpanded); setSelectedCard(null); queueMicrotask(() => { attachCardEvents(); emit({ cardExpanded: isExpanded, cardDomCount: isExpanded ? data.root.cards.length : 0, selectedCardCount: 0 }); });
  }, [attachCardEvents, data, diagram, emit]);

  const build = useCallback(() => {
    const coreView = coreViewRef.current; if (!coreView || !data?.root || builtRef.current) return;
    builtRef.current = true; diagram.clearAll(); nodesRef.current.clear();
    const root = new ControlNode(coreView); root.template = rootNodeHtml(data.root, false); root.bounds = new Rect(66, 8, 125, 52); root.tag = { ...data.root, type: "root", depth: 0 }; root.expandable = true; root.expanded = true; diagram.addItem(root); rootRef.current = root; nodesRef.current.set(root.tag.id, root);
    if (includeTree) {
      data.nodes.forEach((item) => { const node = new ShapeNode(diagram); node.bounds = new Rect(item.x, item.y, 48, 26); node.text = `${item.title}\n${item.description}`; node.brush = item.type === "team" ? "#e6f0ff" : "#f5f7fb"; node.stroke = item.type === "team" ? "#3979ce" : "#90a0b8"; node.tag = { ...item, depth: item.parentId === "root" ? 1 : 2 }; node.expandable = item.type === "team"; node.expanded = true; diagram.addItem(node); nodesRef.current.set(item.id, node); });
      data.nodes.forEach((item) => diagram.factory.createDiagramLink(nodesRef.current.get(item.parentId), nodesRef.current.get(item.id)));
    }
    setLastAction("JSON 데이터로 트리 생성"); queueMicrotask(() => { attachCardEvents(); emit({ integrationReady: true, dataState: "success" }); });
  }, [attachCardEvents, data, diagram, emit, includeTree]);

  useEffect(() => { build(); }, [build]);
  useEffect(() => { if (dataState === "error" || dataState === "empty") emit({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 0, linkCount: 0, dataState, integrationReady: false }); }, [dataState, emit]);

  const onControlLoaded = () => { coreViewRef.current = viewRef.current?.find(); build(); };
  const onNodeDomCreated = () => { attachCardEvents(); emit(); };
  const onSelectionChanged = () => { const node = diagram.selection.nodes[0] || null; setSelected(node?.tag || null); const isRoot = node === rootRef.current; eventCount.current += 1; setLastAction(node ? `노드 선택: ${node.tag.title}` : "선택 해제"); applyRootState(isRoot); queueMicrotask(() => emit({ selectedNodeCount: node ? 1 : 0, eventCount: eventCount.current, lastEvent: node ? `노드 선택: ${node.tag.title}` : "선택 해제" })); };

  const walk = (node, visible) => { node.outgoingLinks.forEach((link) => { link.visible = visible; link.destination.visible = visible; link.destination.expanded = visible; walk(link.destination, visible); }); };
  const collapseSelected = () => { const node = diagram.selection.nodes[0] || rootRef.current; if (!node) return; walk(node, false); node.expanded = false; diagram.invalidate(); setLastAction("선택 가지 재귀 접기"); emit(); };
  const expandSelected = () => { const node = diagram.selection.nodes[0] || rootRef.current; if (!node) return; walk(node, true); node.expanded = true; diagram.invalidate(); setLastAction("선택 가지 재귀 펼치기"); emit(); };
  const collapseAll = () => { const root = rootRef.current; if (!root) return; walk(root, false); root.visible = true; root.expanded = false; diagram.invalidate(); setLastAction("전체 접기"); emit({ visibleNodeCount: 1, visibleLinkCount: 0 }); };
  const expandAll = () => { diagram.nodes.forEach((node) => { node.visible = true; if (node.expandable) node.expanded = true; }); diagram.links.forEach((link) => { link.visible = true; }); diagram.invalidate(); setLastAction("전체 펼치기"); emit({ visibleNodeCount: diagram.nodes.length, visibleLinkCount: diagram.links.length }); };
  const selectRoot = () => {
    const root = rootRef.current;
    if (!root) return;
    diagram.selection.clear();
    diagram.selection.addItem(root);
    setSelected(root.tag);
    eventCount.current += 1;
    setLastAction(`노드 선택: ${root.tag.title}`);
    applyRootState(true);
    queueMicrotask(() => emit({ selectedNodeCount: 1, eventCount: eventCount.current, lastEvent: `노드 선택: ${root.tag.title}` }));
  };
  const centerSelected = () => { const node = diagram.selection.nodes[0] || rootRef.current; const view = coreViewRef.current; if (!node || !view) return; const center = node.bounds.center(); view.scrollTo(center.x, center.y); setLastAction(`선택 중심 이동: ${node.tag.title}`); emit({ centered: true }); };
  const changeZoom = (delta) => { const view = coreViewRef.current; if (!view) return; const next = Math.max(25, Math.min(200, view.zoomFactor + delta)); view.zoomFactor = next; setZoom(next); setLastAction(`확대율 ${next}%`); emit({ zoomFactor: next }); };
  const fit = () => { const view = coreViewRef.current; if (!view) return; view.zoomToFit(); setZoom(Math.round(view.zoomFactor)); setLastAction("화면 맞춤"); emit({ fitted: true, zoomFactor: Math.round(view.zoomFactor) }); };
  const applyVisibility = (predicate) => { const visibleIds = new Set(["root"]); data?.nodes.filter(predicate).forEach((item) => { visibleIds.add(item.id); let parent = item.parentId; while (parent) { visibleIds.add(parent); parent = data.nodes.find((entry) => entry.id === parent)?.parentId; } }); diagram.nodes.forEach((node) => { node.visible = visibleIds.has(node.tag.id); }); diagram.links.forEach((link) => { link.visible = link.origin.visible && link.destination.visible; }); diagram.invalidate(); emit(); };
  const runSearch = () => { const term = query.trim().toLowerCase(); if (!term) expandAll(); else applyVisibility((item) => `${item.title} ${item.description}`.toLowerCase().includes(term)); setLastAction(`검색: ${query || "전체"}`); };
  const runFilter = (next) => { setFilter(next); if (next === "all") expandAll(); else applyVisibility((item) => item.type === next); setLastAction(`필터: ${next}`); };

  useEffect(() => () => { listenersRef.current.forEach((cleanup) => cleanup()); listenersRef.current = []; builtRef.current = false; diagram.clearAll(); }, [diagram]);

  return { diagram, viewRef, data, dataState, error, selected, expanded, selectedCard, zoom, query, setQuery, filter, lastAction, onControlLoaded, onNodeDomCreated, onSelectionChanged, selectRoot, collapseSelected, expandSelected, collapseAll, expandAll, centerSelected, zoomIn: () => changeZoom(20), zoomOut: () => changeZoom(-20), fit, runSearch, runFilter, emit };
}
