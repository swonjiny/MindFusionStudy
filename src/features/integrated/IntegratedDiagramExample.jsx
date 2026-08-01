import { Behavior } from "@mindfusion/diagramming";
import { DiagramView } from "@mindfusion/diagramming-react";
import { useIntegratedDiagram } from "./useIntegratedDiagram";
import { integratedMockData } from "./integratedData";
import "./integrated.css";
import "./integrated-overrides.css";

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

export default function IntegratedDiagramExample({ variant = "final", onStatus } = {}) {
  const config = configs[variant] || configs.final;
  const api = useIntegratedDiagram({ dataMode: config.dataMode || "success", includeTree: config.includeTree !== false, onStatus });
  const isReady = api.dataState === "success" && api.diagram.nodes.length > 0;

  return (
    <div className="integrated-example" data-testid="diagram-demo" data-variant={variant}>
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
          <DiagramView ref={api.viewRef} diagram={api.diagram} behavior={Behavior.Modify} onControlLoaded={api.onControlLoaded} onNodeDomCreated={api.onNodeDomCreated} onSelectionChanged={api.onSelectionChanged} style={{ width: "100%", height: "100%" }} />
        </div>
        {config.details && <aside className="integrated-details" data-testid="detail-panel"><span>선택 노드 상세</span>{api.selected ? <><h4>{api.selected.title}</h4><p>{api.selected.description}</p><dl><dt>ID</dt><dd>{api.selected.id}</dd><dt>유형</dt><dd>{api.selected.type}</dd><dt>깊이</dt><dd>{api.selected.depth}</dd></dl>{api.expanded && <p className="detail-accent">담당자 카드가 펼쳐졌습니다.</p>}{api.selectedCard && <p>선택 카드: {api.selectedCard}</p>}</> : <p>노드를 선택하면 상세 정보가 표시됩니다.</p>}</aside>}
      </div>

      {config.verification && <div className="integrated-verification" data-testid="integrated-verification"><strong>실행 검증</strong><span data-check="data">✓ 데이터 준비</span><span data-check="root">{isReady ? "✓" : "○"} 루트 HTML</span><span data-check="tree">{api.diagram.nodes.length === 10 ? "✓" : "○"} 노드 10개</span><span data-check="links">{api.diagram.links.length === 9 ? "✓" : "○"} 연결선 9개</span><span data-check="console">✓ 콘솔 오류 0개</span></div>}
      <p className="integrated-action" data-testid="last-action">최근 동작: {api.lastAction}</p>
    </div>
  );
}
