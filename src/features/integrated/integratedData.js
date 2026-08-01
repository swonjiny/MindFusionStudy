export const integratedMockData = {
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

export function loadIntegratedData(mode = "success", delay = 260) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mode === "error") reject(new Error("Mock API 응답을 불러오지 못했습니다."));
      else if (mode === "empty") resolve({ root: null, nodes: [] });
      else resolve(structuredClone(integratedMockData));
    }, delay);
  });
}
