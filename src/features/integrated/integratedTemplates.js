export function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

export function avatarDataUri(label, color = "#2468d6") {
  const safeLabel = escapeHtml(label).slice(0, 1);
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="24" fill="${color}"/><text x="48" y="60" text-anchor="middle" font-family="sans-serif" font-size="34" font-weight="700" fill="white">${safeLabel}</text></svg>`)}`;
}

export function rootNodeHtml(root, expanded = false) {
  const cards = expanded ? root.cards.slice(0, 5) : [];
  const cardMarkup = cards.map((card) => `<button type="button" data-card-id="${escapeHtml(card.id)}" data-interactive="true" aria-pressed="false" style="display:flex;align-items:center;gap:9px;width:100%;padding:7px;border:2px solid transparent;border-radius:9px;background:#fff;text-align:left;cursor:pointer"><span style="display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:${card.color};color:white;font:700 13px sans-serif">${escapeHtml(card.nickname[0])}</span><span><strong style="display:block;color:#17345f;font:700 13px sans-serif">${escapeHtml(card.nickname)}</strong><small style="color:#65748a">${escapeHtml(card.intro)}</small></span></button>`).join("");
  return `<section data-mf-integrated-root="true" data-expanded="${expanded}" style="box-sizing:border-box;width:100%;height:100%;padding:12px;border:3px solid ${expanded ? "#2468d6" : "#87a7d2"};border-radius:16px;background:${expanded ? "#edf5ff" : "#f8fbff"};font-family:sans-serif;box-shadow:0 8px 24px #173d7020"><header style="display:grid;grid-template-columns:52px 1fr;gap:11px;align-items:center"><img src="${avatarDataUri(root.title, root.color)}" alt="${escapeHtml(root.title)}" style="width:52px;height:52px;border-radius:13px"><div><strong style="display:block;color:#17345f;font-size:16px">${escapeHtml(root.title)}</strong><span style="display:block;margin-top:3px;color:#61708a;font-size:11px">${escapeHtml(root.description)}</span><small style="display:block;margin-top:4px;color:#2468d6">${escapeHtml(root.meta)}</small></div></header>${expanded ? `<div data-card-list style="display:grid;gap:6px;margin-top:10px">${cardMarkup}</div>` : '<div style="margin-top:8px;color:#6c7b91;font-size:11px;text-align:center">선택하면 담당자 카드를 표시합니다.</div>'}</section>`;
}

export function cardBounds(count, expanded) {
  return expanded
    ? { width: 125 + Math.min(count, 5) * 4, height: 42 + count * 17 }
    : { width: 125, height: 52 };
}
