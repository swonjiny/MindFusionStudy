const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

export function renderFeatureTooltip(feature, visible) {
  if (!feature?.enabled || !visible) return "";
  return `<aside class="city-feature-tooltip" data-testid="city-tree-feature-tooltip">
    <button type="button" data-interactive="true" data-city-action="close-tooltip" aria-label="특징정보 닫기">×</button>
    <strong>★ ${escapeHtml(feature.title)}</strong>
    <p>${escapeHtml(feature.description)}</p>
  </aside>`;
}

export default function CityTreeFeatureTooltip() {
  return null;
}

