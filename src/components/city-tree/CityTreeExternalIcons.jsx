export const categoryMeta = {
  overview: { label: "일반 현황", symbol: "⌂", color: "#2979ff" },
  economy: { label: "경제·산업", symbol: "▥", color: "#2d9d58" },
  traffic: { label: "교통·물류", symbol: "◆", color: "#7258d6" },
  culture: { label: "문화·관광", symbol: "◎", color: "#f06a4f" },
  environment: { label: "환경·에너지", symbol: "♧", color: "#2fa36b" },
  education: { label: "복지·교육", symbol: "◇", color: "#2577e3" },
  administration: { label: "행정·재정", symbol: "⬡", color: "#6547c7" },
  safety: { label: "안전·재난", symbol: "♢", color: "#e45673" },
  tourism: { label: "관광·레저", symbol: "☆", color: "#f0882f" },
  housing: { label: "주거·생활", symbol: "▦", color: "#3c9f8a" },
};

export function renderExternalIcons(categories = []) {
  return `<div class="city-node-icons" data-testid="city-tree-external-icons">${categories.map((category) => {
    const meta = categoryMeta[category] || categoryMeta.overview;
    return `<span class="city-node-icon" role="img" aria-label="${meta.label}" title="${meta.label}" style="--icon-color:${meta.color}">${meta.symbol}</span>`;
  }).join("")}</div>`;
}

export default function CityTreeExternalIcons({ categories = [] }) {
  return (
    <div className="city-legend-list">
      {categories.map((category) => {
        const meta = categoryMeta[category];
        return <span key={category}><b style={{ color: meta.color }}>{meta.symbol}</b>{meta.label}</span>;
      })}
    </div>
  );
}

