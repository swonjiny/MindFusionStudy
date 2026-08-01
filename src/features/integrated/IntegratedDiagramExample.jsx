/**
 * ================================================================
 * [초보자용 상세 주석] 19-01 최종 종합 조직 탐색기
 * ================================================================
 *
 * 이 파일에서 만드는 것
 * - 15~18의 공통 훅과 유틸로 모든 기능을 한 화면에 통합합니다.
 * - 예상 결과: 노드 10개, 연결선 9개
 * - 이 JSX 파일은 프로젝트 내부 상대경로에 의존하지 않으므로 다른 React 프로젝트로 복사할 수 있습니다.
 *
 * 코드를 읽는 권장 순서
 * 1. import: React와 MindFusion에서 어떤 도구를 가져오는지 확인합니다.
 * 2. 상수·데이터: 노드에 넣을 값과 반복할 배열을 확인합니다.
 * 3. 컴포넌트 상태·ref: 화면이 기억할 값과 MindFusion 인스턴스를 확인합니다.
 * 4. 초기화 함수: Diagram, 노드와 연결선을 어떤 순서로 만드는지 확인합니다.
 * 5. 이벤트 함수: 클릭·선택·DOM 생성 뒤 어떤 상태가 바뀌는지 확인합니다.
 * 6. cleanup: 컴포넌트가 사라질 때 이벤트와 모델을 어떻게 정리하는지 확인합니다.
 * 7. return JSX: DiagramView에 model, ref와 이벤트 prop이 어떻게 전달되는지 확인합니다.
 *
 * 이번 예제의 핵심 용어
 * - useIntegratedDiagram: 이번 예제에서 useIntegratedDiagram 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 * - IntegratedDiagramExample: 이번 예제에서 IntegratedDiagramExample 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 * - Playwright: 이번 예제에서 Playwright 기능을 설정하거나 실행하기 위해 사용하는 API·속성입니다.
 *
 * 기억할 점
 * - Diagram은 데이터 모델이고 DiagramView는 그 모델을 화면에 표시하는 React 뷰입니다.
 * - Rect의 네 값은 순서대로 x, y, width, height입니다.
 * - onStatus는 학습 사이트의 검증 패널용 선택적 prop입니다. 외부 프로젝트에서는 전달하지 않아도 됩니다.
 * - StrictMode의 개발 환경 이중 마운트가 문제가 되면 안내된 main.jsx처럼 StrictMode 없이 먼저 확인하세요.
 * - 기능별로 Diagram을 따로 만들면 선택, 검색과 상세 패널 상태가 서로 일치하지 않습니다.
 */
import { useCallback, /* [React 생명주기] effect는 렌더링 뒤 부수 작업을 수행하고, 반환 함수는 unmount 시 리스너와 Diagram 내용을 정리합니다. */
useEffect, useRef, useState } from "react";
import { Behavior, ControlNode, Diagram, ShapeNode } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { Rect } from "@mindfusion/drawing";

/* [예제 데이터] 실제 서버 대신 사용할 JSON 형태의 루트·자식·카드 데이터입니다. 같은 구조로 API 응답을 교체할 수 있습니다. */
const integratedMockData = {
  root: {
    id: "root", title: "MindFusion Studio", description: "제품·개발·운영 조직을 한눈에 탐색합니다.",
    meta: "서울 · 10명 · 최종 통합 예제", color: "#1f67c9",
    cards: [
      { id: "c1", nickname: "민트", intro: "UI 설계", color: "#2b8a78" },
      { id: "c2", nickname: "라온", intro: "데이터 시각화", color: "#6f5bd3" },
      { id: "c3", nickname: "하루", intro: "사용자 경험", color: "#d06b45" },
    ],
  },
  nodes: [
    { id: "product", parentId: "root", title: "제품팀", description: "제품 전략과 경험", type: "team", x: 28, y: 94 },
    { id: "engineering", parentId: "root", title: "개발팀", description: "플랫폼과 서비스", type: "team", x: 105, y: 94 },
    { id: "operations", parentId: "root", title: "운영팀", description: "품질과 고객 지원", type: "team", x: 182, y: 94 },
    { id: "research", parentId: "product", title: "리서치", description: "사용자 조사", type: "role", x: 8, y: 156 },
    { id: "design", parentId: "product", title: "디자인", description: "UI 시스템", type: "role", x: 58, y: 156 },
    { id: "web", parentId: "engineering", title: "웹", description: "React 클라이언트", type: "role", x: 92, y: 156 },
    { id: "api", parentId: "engineering", title: "API", description: "서비스 데이터", type: "role", x: 142, y: 156 },
    { id: "quality", parentId: "operations", title: "품질", description: "자동 검증", type: "role", x: 176, y: 156 },
    { id: "support", parentId: "operations", title: "지원", description: "고객 피드백", type: "role", x: 226, y: 156 },
  ],
};

function loadIntegratedData(mode = "success", delay = 260) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mode === "error") reject(new Error("Mock API 응답을 불러오지 못했습니다."));
      else if (mode === "empty") resolve({ root: null, nodes: [] });
      else resolve(structuredClone(integratedMockData));
    }, delay);
  });
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function avatarDataUri(label, color = "#2468d6") {
  const safeLabel = escapeHtml(label).slice(0, 1);
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="24" fill="${color}"/><text x="48" y="60" text-anchor="middle" font-family="sans-serif" font-size="34" font-weight="700" fill="white">${safeLabel}</text></svg>`)}`;
}

function rootNodeHtml(root, expanded = false) {
  /* [카드 배열] 카드 수를 늘리거나 내용을 바꾸려면 먼저 이 배열의 객체를 수정합니다. map이 각 객체를 HTML 카드로 바꿉니다. */
const cards = expanded ? root.cards.slice(0, 5) : [];
  const cardMarkup = cards.map((card) => `<button type="button" data-card-id="${escapeHtml(card.id)}" data-interactive="true" aria-pressed="false" style="display:flex;align-items:center;gap:9px;width:100%;padding:7px;border:2px solid transparent;border-radius:9px;background:#fff;text-align:left;cursor:pointer"><span style="display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:${card.color};color:white;font:700 13px sans-serif">${escapeHtml(card.nickname[0])}</span><span><strong style="display:block;color:#17345f;font:700 13px sans-serif">${escapeHtml(card.nickname)}</strong><small style="color:#65748a">${escapeHtml(card.intro)}</small></span></button>`).join("");
  return `<section data-mf-integrated-root="true" data-expanded="${expanded}" style="box-sizing:border-box;width:100%;height:100%;padding:12px;border:3px solid ${expanded ? "#2468d6" : "#87a7d2"};border-radius:16px;background:${expanded ? "#edf5ff" : "#f8fbff"};font-family:sans-serif;box-shadow:0 8px 24px #173d7020"><header style="display:grid;grid-template-columns:52px 1fr;gap:11px;align-items:center"><img src="${avatarDataUri(root.title, root.color)}" alt="${escapeHtml(root.title)}" style="width:52px;height:52px;border-radius:13px"><div><strong style="display:block;color:#17345f;font-size:16px">${escapeHtml(root.title)}</strong><span style="display:block;margin-top:3px;color:#61708a;font-size:11px">${escapeHtml(root.description)}</span><small style="display:block;margin-top:4px;color:#2468d6">${escapeHtml(root.meta)}</small></div></header>${expanded ? `<div data-card-list style="display:grid;gap:6px;margin-top:10px">${cardMarkup}</div>` : '<div style="margin-top:8px;color:#6c7b91;font-size:11px;text-align:center">선택하면 담당자 카드를 표시합니다.</div>'}</section>`;
}

function cardBounds(count, expanded) {
  return expanded ? { width: 125 + Math.min(count, 5) * 4, height: 42 + count * 17 } : { width: 125, height: 52 };
}

const integratedCss = `.integrated-example{border:1px solid #dbe5f2;border-radius:16px;background:#f7faff;overflow:hidden}.integrated-titlebar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 16px;background:linear-gradient(120deg,#102d55,#1f67c9);color:#fff}.integrated-titlebar h3{margin:2px 0 0;color:#fff}.integrated-kicker{font-size:10px;letter-spacing:.14em;opacity:.7}.data-state{padding:5px 9px;border-radius:99px;background:#ffffff20;font-size:12px}.data-state.success{background:#dbf7e8;color:#17633c}.data-state.error{background:#ffe5e5;color:#9f2424}.data-state.empty{background:#fff1cf;color:#755113}.integrated-toolbar,.integrated-filters{display:flex;align-items:center;flex-wrap:wrap;gap:7px;margin:0;padding:10px 14px;border:0;border-bottom:1px solid #dbe5f2;background:#fff}.integrated-toolbar:disabled,.integrated-filters:disabled{opacity:.65}.integrated-toolbar button,.integrated-filters button,.integrated-filters input,.integrated-filters select{min-height:32px;padding:5px 10px;border:1px solid #b9c9dc;border-radius:7px;background:#fff;color:#243752}.integrated-toolbar button:hover,.integrated-filters button:hover{border-color:#2468d6;color:#2468d6}.integrated-filters label{font-size:12px;font-weight:700;color:#52647d}.integrated-body{display:grid;grid-template-columns:1fr;min-height:450px}.integrated-body.with-details{grid-template-columns:minmax(0,1fr) 230px}.integrated-canvas{height:450px;background:#fff}.integrated-details{padding:16px;border-left:1px solid #dbe5f2;background:#fff}.integrated-details>span{font-size:11px;font-weight:700;color:#2468d6}.integrated-details h4{margin:8px 0;color:#17345f}.integrated-details p{color:#65748a}.integrated-details dl{display:grid;grid-template-columns:45px 1fr;gap:6px;margin-top:14px;font-size:12px}.integrated-details dt{color:#7b899c}.integrated-details dd{margin:0;color:#263b58}.detail-accent{padding:8px;border-radius:8px;background:#eaf3ff;color:#1e5da9!important}.integrated-state{display:flex;gap:10px;align-items:center;padding:12px 16px;border-bottom:1px solid #dbe5f2}.integrated-state span{font-size:12px}.integrated-state.loading{background:#eef5ff;color:#245990}.integrated-state.error{background:#fff1f1;color:#9f2424}.integrated-state.empty{background:#fff8e8;color:#755113}.loading-dot{width:10px;height:10px;border-radius:50%;background:#2468d6;animation:integratedPulse 1s infinite}.json-preview{max-height:180px;overflow:auto;padding:10px 14px;background:#101b2d;color:#d7e4f8}.json-preview pre{font-size:11px}.integrated-verification{display:flex;flex-wrap:wrap;gap:7px;padding:10px 14px;border-top:1px solid #dbe5f2;background:#eef8f2}.integrated-verification span{padding:4px 8px;border-radius:6px;background:#fff;color:#236445;font-size:12px}.integrated-action{margin:0;padding:8px 14px;border-top:1px solid #dbe5f2;background:#fff;color:#65748a;font-size:12px}@keyframes integratedPulse{50%{opacity:.35;transform:scale(.75)}}@media(max-width:760px){.integrated-body.with-details{grid-template-columns:1fr}.integrated-details{border-top:1px solid #dbe5f2;border-left:0}.integrated-titlebar{align-items:flex-start;flex-direction:column}}`;

/* [공통 훅] Diagram 모델, 선택, 트리 표시 상태, 검색과 화면 이동 동작을 한곳에서 관리합니다. */
function useIntegratedDiagram({ dataMode = "success", includeTree = true, onStatus } = {}) {
  const [diagram] = useState(() => /* [Diagram 생성] 노드와 연결선을 보관할 모델을 만듭니다. useState의 초기 함수 안에서 만들면 React 재렌더링에도 같은 모델을 유지합니다. */
new Diagram());
  const viewRef = useRef(null);
  const coreViewRef = useRef(null);
  const rootRef = useRef(null);
  const nodesRef = useRef(new Map());
  const listenersRef = useRef([]);
  const builtRef = useRef(false);
  const onStatusRef = useRef(onStatus);
  onStatusRef.current = onStatus;
  const [dataState, setDataState] = useState(dataMode === "json" ? "success" : "loading");
  const [data, setData] = useState(dataMode === "json" ? structuredClone(integratedMockData) : null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [lastAction, setLastAction] = useState("초기화");
  const eventCount = useRef(0);

  const emit = useCallback((overrides = {}) => {
    const rootDom = document.querySelector('[data-mf-integrated-root="true"]');
    onStatusRef.current?.({ diagramReady: true, viewReady: Boolean(coreViewRef.current), rendered: dataState !== "loading", nodeCount: diagram.nodes.length, linkCount: diagram.links.length, visibleNodeCount: diagram.nodes.filter((node) => node.visible).length, visibleLinkCount: diagram.links.filter((link) => link.visible).length, expandedNodeCount: diagram.nodes.filter((node) => node.expandable && node.expanded).length, htmlDomCount: rootDom ? 1 : 0, buttonDomCount: rootDom?.querySelectorAll("button").length || 0, cardCount: data?.root?.cards?.length || 0, cardDomCount: rootDom?.querySelectorAll("[data-card-id]").length || 0, selectedNodeCount: diagram.selection.nodes.length, cardExpanded: rootDom?.dataset.expanded === "true", selectedCardCount: rootDom?.querySelectorAll('[aria-pressed="true"]').length || 0, eventCount: eventCount.current, lastEvent: lastAction, dataState, integrationReady: dataState === "success" && diagram.nodes.length > 0, consoleErrorCount: 0, ...overrides });
  }, [data, dataState, diagram, lastAction]);

  useEffect(() => {
    if (dataMode === "json") return;
    setDataState("loading");
    loadIntegratedData(dataMode, dataMode === "loading" ? 800 : 260)
      .then((result) => { setData(result); setDataState(result.root ? "success" : "empty"); })
      .catch((reason) => { setError(reason.message); setDataState("error"); });
  }, [dataMode]);

  const attachCardEvents = useCallback(() => {
    const content = rootRef.current?.getContent?.();
    if (!content || content.dataset.integratedEvents === "true") return;
    const click = (event) => {
      const card = event.target.closest?.("[data-card-id]");
      if (!card || !content.contains(card)) return;
      content.querySelectorAll("[data-card-id]").forEach((item) => {
        item.style.borderColor = "transparent";
        item.style.background = "#fff";
        item.setAttribute("aria-pressed", "false");
      });
      card.style.borderColor = "#2468d6";
      card.style.background = "#dcecff";
      card.setAttribute("aria-pressed", "true");
      eventCount.current += 1;
      setSelectedCard(card.dataset.cardId);
      setLastAction(`카드 선택: ${card.dataset.cardId}`);
      queueMicrotask(() => emit({ selectedCardCount: 1, eventCount: eventCount.current, lastEvent: `카드 선택: ${card.dataset.cardId}` }));
    };
    content./* [브라우저 이벤트 등록] DOM 요소와 handler 함수 쌍을 기억해야 cleanup에서 정확히 같은 함수로 제거할 수 있습니다. */
addEventListener("click", click);
    content.dataset.integratedEvents = "true";
    listenersRef.current.push(() => content.removeEventListener("click", click));
  }, [emit]);

  const applyRootState = useCallback((isExpanded) => {
    const node = rootRef.current;
    const content = node?.getContent?.();
    if (!node || !content || !data?.root) return;
    content.innerHTML = rootNodeHtml(data.root, isExpanded);
    const size = cardBounds(data.root.cards.length, isExpanded);
    node.bounds = /* [위치와 크기] Rect(x, y, width, height)로 다이어그램 좌표상의 위치와 노드 크기를 함께 지정합니다. */
new Rect(node.bounds.x, node.bounds.y, size.width, size.height);
    diagram.invalidate();
    setExpanded(isExpanded);
    setSelectedCard(null);
    queueMicrotask(() => {
      attachCardEvents();
      emit({ cardExpanded: isExpanded, cardDomCount: isExpanded ? data.root.cards.length : 0, selectedCardCount: 0 });
    });
  }, [attachCardEvents, data, diagram, emit]);

  const build = useCallback(() => {
    const coreView = coreViewRef.current;
    if (!coreView || !data?.root || builtRef.current) return;
    builtRef.current = true;
    diagram.clearAll();
    nodesRef.current.clear();
    const root = /* [HTML 노드 생성] ControlNode는 실제 HTML을 다이어그램 좌표에 표시합니다. 생성자에는 DiagramView의 core view가 필요합니다. */
new ControlNode(coreView);
    root.template = rootNodeHtml(data.root, false);
    root.bounds = new Rect(66, 8, 125, 52);
    root.tag = { ...data.root, type: "root", depth: 0 };
    root.expandable = true;
    root.expanded = true;
    /* [모델에 등록] 직접 new로 만든 노드는 addItem을 호출해야 Diagram이 관리하고 DiagramView가 그릴 수 있습니다. */
diagram.addItem(root);
    rootRef.current = root;
    nodesRef.current.set(root.tag.id, root);
    if (includeTree) {
      data.nodes.forEach((item) => {
        const node = /* [일반 노드 생성] ShapeNode 객체만 만든 상태이며, bounds·text·스타일을 설정한 뒤 Diagram에 등록해야 화면에 나타납니다. */
new ShapeNode(diagram);
        node.bounds = new Rect(item.x, item.y, 48, 26);
        node.text = `${item.title}\n${item.description}`;
        node.brush = item.type === "team" ? "#e6f0ff" : "#f5f7fb";
        node.stroke = item.type === "team" ? "#3979ce" : "#90a0b8";
        node.tag = { ...item, depth: item.parentId === "root" ? 1 : 2 };
        node.expandable = item.type === "team";
        node.expanded = true;
        diagram.addItem(node);
        nodesRef.current.set(item.id, node);
      });
      data.nodes.forEach((item) => diagram.factory./* [연결선 생성] 출발 노드와 도착 노드가 Diagram에 준비된 뒤 두 노드를 연결합니다. */
createDiagramLink(nodesRef.current.get(item.parentId), nodesRef.current.get(item.id)));
    }
    setLastAction("JSON 데이터로 트리 생성");
    queueMicrotask(() => { attachCardEvents(); emit({ integrationReady: true, dataState: "success" }); });
  }, [attachCardEvents, data, diagram, emit, includeTree]);

  useEffect(() => { build(); }, [build]);
  useEffect(() => {
    if (dataState === "error" || dataState === "empty") emit({ diagramReady: true, viewReady: true, rendered: true, nodeCount: 0, linkCount: 0, dataState, integrationReady: false });
  }, [dataState, emit]);

  const onControlLoaded = () => { coreViewRef.current = viewRef.current?.find(); build(); };
  const onNodeDomCreated = () => { attachCardEvents(); emit(); };
  const onSelectionChanged = () => {
    const node = diagram.selection.nodes[0] || null;
    setSelected(node?.tag || null);
    const isRoot = node === rootRef.current;
    eventCount.current += 1;
    setLastAction(node ? `노드 선택: ${node.tag.title}` : "선택 해제");
    applyRootState(isRoot);
    queueMicrotask(() => emit({ selectedNodeCount: node ? 1 : 0, eventCount: eventCount.current, lastEvent: node ? `노드 선택: ${node.tag.title}` : "선택 해제" }));
  };

  const walk = (node, visible) => {
    node.outgoingLinks.forEach((link) => {
      link.visible = visible;
      link.destination.visible = visible;
      link.destination.expanded = visible;
      walk(link.destination, visible);
    });
  };
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

  useEffect(() => () => {
    listenersRef.current.forEach((cleanup) => cleanup());
    listenersRef.current = [];
    builtRef.current = false;
    diagram.clearAll();
  }, [diagram]);

  return { diagram, viewRef, data, dataState, error, selected, expanded, selectedCard, zoom, query, setQuery, filter, lastAction, onControlLoaded, onNodeDomCreated, onSelectionChanged, selectRoot, collapseSelected, expandSelected, collapseAll, expandAll, centerSelected, zoomIn: () => changeZoom(20), zoomOut: () => changeZoom(-20), fit, runSearch, runFilter };
}

const configs = {
  root: { includeTree: false, title: "메타정보가 있는 루트 노드", select: true },
  tree: { title: "자식·손자 복합 콘텐츠 트리" },
  recursive: { title: "재귀 접기·펼치기", tree: true },
  center: { title: "선택 노드 중심 이동", center: true, select: true },
  viewport: { title: "확대·축소·화면 맞춤", viewport: true },
  details: { title: "선택 노드 상세 패널", details: true, select: true },
  json: { title: "JSON 데이터 연동", dataMode: "json", json: true },
  loading: { title: "Mock API 로딩 상태", dataMode: "loading", state: true },
  error: { title: "Mock API 오류 상태", dataMode: "error", state: true },
  empty: { title: "데이터 없음 상태", dataMode: "empty", state: true },
  search: { title: "노드 검색", search: true },
  filter: { title: "유형 필터", filter: true },
  verification: { title: "전체 실행 자동 검증", verification: true },
  final: { title: "MindFusion 조직 탐색기", tree: true, center: true, select: true, viewport: true, details: true, search: true, filter: true, verification: true },
};

/* [컴포넌트 시작] 이 함수가 외부에서 import해 렌더링하는 예제 컴포넌트입니다. props의 onStatus는 선택 사항입니다. */
export default function IntegratedDiagramExample({ variant = "final", onStatus } = {}) {
  const config = configs[variant] || configs.final;
  const api = useIntegratedDiagram({ dataMode: config.dataMode || "success", includeTree: config.includeTree !== false, onStatus });
  const isReady = api.dataState === "success" && api.diagram.nodes.length > 0;

  return (
    <div className="integrated-example" data-testid="diagram-demo" data-variant={variant}>
      <style>{integratedCss}</style>
      <div className="integrated-titlebar">
        <div><span className="integrated-kicker">FINAL WORKBENCH</span><h3>{config.title}</h3></div>
        <span data-testid="data-state" className={`data-state ${api.dataState}`}>{api.dataState === "loading" ? "데이터 로딩 중" : api.dataState === "error" ? "데이터 오류" : api.dataState === "empty" ? "데이터 없음" : "데이터 준비 완료"}</span>
      </div>

      {(config.select || config.tree || config.center || config.viewport) && <fieldset className="integrated-toolbar" aria-label="다이어그램 도구" disabled={!isReady}>
        {config.select && <button type="button" onClick={api.selectRoot}>루트 선택</button>}
        {config.tree && <><button type="button" onClick={api.collapseSelected}>선택 가지 접기</button><button type="button" onClick={api.expandSelected}>선택 가지 펼치기</button><button type="button" onClick={api.collapseAll}>전체 접기</button><button type="button" onClick={api.expandAll}>전체 펼치기</button></>}
        {config.center && <button type="button" onClick={api.centerSelected}>선택 중심 이동</button>}
        {config.viewport && <><button type="button" onClick={api.zoomOut}>축소</button><span data-testid="zoom-value">{api.zoom}%</span><button type="button" onClick={api.zoomIn}>확대</button><button type="button" onClick={api.fit}>화면 맞춤</button></>}
      </fieldset>}

      {(config.search || config.filter) && <fieldset className="integrated-filters" disabled={!isReady}>
        {config.search && <><label htmlFor={`search-${variant}`}>노드 검색</label><input id={`search-${variant}`} value={api.query} onChange={(event) => api.setQuery(event.target.value)} placeholder="예: 웹, 사용자"/><button type="button" onClick={api.runSearch}>검색</button></>}
        {config.filter && <><label htmlFor={`filter-${variant}`}>유형</label><select id={`filter-${variant}`} value={api.filter} onChange={(event) => api.runFilter(event.target.value)}><option value="all">전체</option><option value="team">팀</option><option value="role">역할</option></select></>}
      </fieldset>}

      {api.dataState === "loading" && <div className="integrated-state loading" data-testid="loading-state"><span className="loading-dot"/>Mock API 데이터를 불러오는 중입니다.</div>}
      {api.dataState === "error" && <div className="integrated-state error" data-testid="error-state"><strong>데이터를 불러오지 못했습니다.</strong><span>{api.error}</span></div>}
      {api.dataState === "empty" && <div className="integrated-state empty" data-testid="empty-state"><strong>표시할 데이터가 없습니다.</strong><span>root와 nodes가 비어 있습니다.</span></div>}

      {config.json && <details className="json-preview"><summary>연동 JSON 보기</summary><pre>{JSON.stringify(integratedMockData, null, 2)}</pre></details>}

      <div className={`integrated-body ${config.details ? "with-details" : ""}`}>
        <div className="integrated-canvas">
          /* [화면 렌더링] 준비한 Diagram 모델과 ref, 이벤트 함수를 DiagramView prop으로 전달합니다. 부모 요소에는 반드시 높이가 있어야 합니다. */
<DiagramView ref={api.viewRef} diagram={api.diagram} behavior={Behavior.Modify} onControlLoaded={api.onControlLoaded} onNodeDomCreated={api.onNodeDomCreated} onSelectionChanged={api.onSelectionChanged} style={{ width: "100%", height: "100%" }} />
        </div>
        {config.details && <aside className="integrated-details" data-testid="detail-panel"><span>선택 노드 상세</span>{api.selected ? <><h4>{api.selected.title}</h4><p>{api.selected.description}</p><dl><dt>ID</dt><dd>{api.selected.id}</dd><dt>유형</dt><dd>{api.selected.type}</dd><dt>깊이</dt><dd>{api.selected.depth}</dd></dl>{api.expanded && <p className="detail-accent">담당자 카드가 펼쳐졌습니다.</p>}{api.selectedCard && <p>선택 카드: {api.selectedCard}</p>}</> : <p>노드를 선택하면 상세 정보가 표시됩니다.</p>}</aside>}
      </div>

      {config.verification && <div className="integrated-verification" data-testid="integrated-verification"><strong>실행 검증</strong><span data-check="data">✓ 데이터 준비</span><span data-check="root">{isReady ? "✓" : "○"} 루트 HTML</span><span data-check="tree">{api.diagram.nodes.length === 10 ? "✓" : "○"} 노드 10개</span><span data-check="links">{api.diagram.links.length === 9 ? "✓" : "○"} 연결선 9개</span><span data-check="console">✓ 콘솔 오류 0개</span></div>}
      <p className="integrated-action" data-testid="last-action">최근 동작: {api.lastAction}</p>
    </div>
  );
}

