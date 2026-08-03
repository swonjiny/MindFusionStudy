const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

export function renderDetailCards(cards = []) {
  return `<div class="city-detail-cards" data-testid="city-tree-detail-card-count" data-count="${cards.length}">${cards.map((card) => `
    <article class="city-detail-card" data-detail-card-id="${escapeHtml(card.id)}">
      <span class="city-detail-card-image" role="img" aria-label="${escapeHtml(card.title)} 대표 이미지" style="background-image:url('${card.image}')"></span>
      <strong>${escapeHtml(card.title)}</strong>
      <p>${escapeHtml(card.description)}</p>
    </article>`).join("")}</div>`;
}

export default function CityTreeDetailCards() {
  return null;
}
