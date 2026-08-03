import { renderDetailCards } from "./CityTreeDetailCards";
import { renderExternalIcons } from "./CityTreeExternalIcons";
import { renderFeatureTooltip } from "./CityTreeFeatureTooltip";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

export function renderCityTreeNode(node, options = {}) {
  const {
    selected = false,
    collapsed = false,
    detailExpanded = false,
    showIcons = false,
    showDetailButton = false,
    showCollapseButton = false,
    showFeatureTooltip = false,
  } = options;
  const hasChildren = node.children.length > 0;
  const detailButton = showDetailButton
    ? `<button type="button" class="city-node-detail-button" data-interactive="true" data-city-action="${detailExpanded ? "restore-detail" : "expand-detail"}">${detailExpanded ? "원래대로 가기" : "상세정보 보기"}</button>`
    : "";
  const toggleButton = showCollapseButton && hasChildren
    ? `<button type="button" class="city-node-toggle" data-interactive="true" data-city-action="toggle-children" aria-label="${node.title} 자식 ${collapsed ? "펼치기" : "접기"}">${collapsed ? "+" : "−"}</button>`
    : "";
  return `<section class="city-node-shell ${detailExpanded ? "is-detail-expanded" : ""} ${showFeatureTooltip ? "has-feature-tooltip" : ""}" data-city-node-id="${node.id}" data-selected="${selected}" data-expanded-detail="${detailExpanded}">
    <article class="city-node-card">
      <div class="city-node-main">
        <span class="city-node-image" role="img" aria-label="${escapeHtml(node.title)} 대표 이미지" style="background-image:url('${node.image}')"></span>
        <div class="city-node-copy"><strong>${escapeHtml(node.title)}</strong><p>${escapeHtml(node.summary)}</p></div>
        ${toggleButton}
      </div>
      ${showDetailButton ? `<div class="city-node-actions">${detailButton}</div>` : ""}
      ${detailExpanded ? renderDetailCards(node.detailCards || []) : ""}
    </article>
    ${showIcons ? renderExternalIcons(node.categoryIcons) : ""}
    ${renderFeatureTooltip(node.featureTooltip, showFeatureTooltip)}
  </section>`;
}

export default function CityTreeNode() {
  return null;
}
