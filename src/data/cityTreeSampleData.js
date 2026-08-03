const escapeSvg = (value) => encodeURIComponent(value).replace(/'/g, "%27");

const cityImage = (label, colors = ["#0f5fbf", "#77c4ea"]) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="24" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs>
    <rect width="640" height="360" fill="url(#sky)"/><circle cx="520" cy="76" r="38" fill="#fff" opacity=".75"/>
    <path d="M0 250L72 190l50 38 80-112 92 124 74-76 92 79 70-54 110 66v105H0z" fill="#163e67" opacity=".82"/>
    <path d="M0 278c110-28 214 22 322-2 108-23 214-2 318 18v66H0z" fill="#cfeffc" opacity=".9"/>
    <text x="30" y="55" fill="#fff" font-size="30" font-family="Arial, sans-serif" font-weight="700">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${escapeSvg(svg)}`;
};

const details = (parentTitle, type, area, population, administrativeAreas, establishedAt, description, indicators, institutions, detailUrl = "#") => ({
  parentTitle,
  type,
  country: "대한민국",
  area,
  population,
  administrativeAreas,
  establishedAt,
  description,
  indicators,
  institutions,
  detailUrl,
});

const leaf = (id, title, summary, parentTitle, colors, categoryIcons, extra = {}) => ({
  id,
  type: "neighborhood",
  title,
  summary,
  image: cityImage(title, colors),
  categoryIcons,
  detail: details(parentTitle, "행정동", extra.area || "2.4㎢", extra.population || "31,000명", "주민센터 1곳", extra.establishedAt || "행정동 기준", extra.description || `${title}의 생활·문화 정보를 소개합니다.`, extra.indicators || ["생활 편의", "지역 문화"], extra.institutions || ["주민센터", "생활문화센터"]),
  children: [],
});

export const cityTreeRoots = [
  {
    id: "seoul",
    type: "city-root",
    title: "서울특별시",
    summary: "대한민국의 수도이자 정치·경제·문화의 중심지",
    image: cityImage("SEOUL", ["#355f91", "#d5dce5"]),
    expanded: true,
    detailExpanded: false,
    categoryIcons: ["overview", "economy", "traffic", "culture", "environment", "education", "administration", "safety"],
    featureTooltip: {
      enabled: true,
      title: "특징정보",
      description: "대한민국의 수도로 정치·경제·문화·교통 기능이 집중된 글로벌 도시입니다.",
    },
    detail: details("대한민국", "특별시", "605.2㎢", "9,386,000명", "25개 자치구", "1946년 9월 28일", "대한민국의 수도이자 정치·경제·문화의 중심지입니다.", ["GRDP 472조 원", "대중교통 분담률 65%"], ["서울특별시청", "서울관광재단"]),
    children: [
      {
        id: "gangnam",
        type: "district",
        title: "강남구",
        summary: "비즈니스와 문화가 만나는 핵심 지역",
        image: cityImage("GANGNAM", ["#274b78", "#70a4cf"]),
        categoryIcons: ["overview", "economy", "traffic", "culture"],
        detail: details("서울특별시", "자치구", "39.50㎢", "556,000명", "22개 동", "1975년 10월 1일", "업무·상업·문화 기능이 밀집한 서울의 대표 거점입니다.", ["사업체 7만여 개", "지하철 6개 노선"], ["강남구청", "코엑스"]),
        children: [
          leaf("yeoksam", "역삼동", "업무 시설이 집중된 도심 지역", "강남구", ["#4d6681", "#b8cedf"], ["overview", "economy", "traffic"]),
          leaf("samseong", "삼성동", "MICE와 국제 업무의 중심", "강남구", ["#344d6b", "#9bb7cc"], ["overview", "economy", "culture"]),
        ],
      },
      {
        id: "mapo",
        type: "district",
        title: "마포구",
        summary: "창작과 미디어 산업의 활력 지역",
        image: cityImage("MAPO", ["#7b487b", "#dfa0b4"]),
        categoryIcons: ["overview", "culture", "traffic", "housing"],
        detail: details("서울특별시", "자치구", "23.85㎢", "365,000명", "16개 동", "1944년 11월 1일", "한강과 문화·미디어 산업이 어우러진 서북권 중심지입니다.", ["문화시설 140여 곳", "공원 95곳"], ["마포구청", "문화비축기지"]),
        children: [
          leaf("hongdae", "홍대동", "공연과 창작 문화의 중심", "마포구", ["#792f6c", "#e4a9c8"], ["overview", "culture", "tourism"]),
          leaf("sangam", "상암동", "디지털 미디어 산업의 거점", "마포구", ["#2f627b", "#9dcbd4"], ["overview", "economy", "environment"]),
        ],
      },
      {
        id: "jongno",
        type: "district",
        title: "종로구",
        summary: "궁궐과 역사 문화의 중심지",
        image: cityImage("JONGNO", ["#79452d", "#d6a26a"]),
        categoryIcons: ["overview", "culture", "tourism", "administration"],
        detail: details("서울특별시", "자치구", "23.91㎢", "139,000명", "17개 동", "1943년 6월 10일", "역사 문화유산과 공공기관이 모인 서울의 중심부입니다.", ["궁궐 4곳", "박물관·미술관 60여 곳"], ["종로구청", "세종문화회관"]),
        children: [],
      },
    ],
  },
  {
    id: "busan",
    type: "city-root",
    title: "부산광역시",
    summary: "대한민국 제2의 도시, 항만·관광·산업의 중심",
    image: cityImage("BUSAN", ["#11639a", "#ef9b4f"]),
    expanded: true,
    detailExpanded: false,
    categoryIcons: ["overview", "economy", "traffic", "culture", "environment", "education"],
    detail: details("대한민국", "광역시", "770.2㎢", "3,293,000명", "16개 구·군", "1963년 1월 1일", "항만·해양·관광 산업이 발달한 대한민국 남동권 중심도시입니다.", ["부산항 물동량 2,275만 TEU", "해안선 306km"], ["부산광역시청", "부산관광공사"]),
    children: [
      {
        id: "haeundae",
        type: "district",
        title: "해운대구",
        summary: "해변과 관광의 대표 지역",
        image: cityImage("HAEUNDAE", ["#1785bd", "#9ddcf3"]),
        categoryIcons: ["overview", "tourism", "culture", "environment"],
        detail: details("부산광역시", "자치구", "51.46㎢", "385,062명", "18개 동", "1988년 1월 1일", "해변과 관광, MICE 산업이 발달한 부산의 대표적인 관광·상업 중심지입니다.", ["GRDP 18조 2,645억 원", "1인당 GRDP 47,360천 원", "인구밀도 7,478명/㎢", "재정자립도 58.4%"], ["해운대구청", "해운대문화재단", "벡스코"], "https://www.haeundae.go.kr/"),
        detailCards: [
          { id: "tour", title: "관광·레저", description: "해운대 해수욕장을 중심으로 한 국내 대표 관광지", image: cityImage("TOUR", ["#197ab0", "#9bd9ee"]) },
          { id: "mice", title: "MICE·컨벤션", description: "벡스코를 중심으로 국제회의와 전시가 활발한 지역", image: cityImage("MICE", ["#355c78", "#a5c2d4"]) },
          { id: "ocean", title: "해양문화", description: "동백섬과 누리마루 등 해양문화 자원이 풍부한 지역", image: cityImage("OCEAN", ["#0c6f88", "#73c2bf"]) },
        ],
        children: [
          leaf("udong", "우동", "해운대 해변과 센텀 생활권", "해운대구", ["#176c9c", "#a7d9ea"], ["overview", "housing", "tourism"]),
          leaf("jungdong", "중동", "달맞이길과 해안 주거 지역", "해운대구", ["#2b7893", "#a8d4cf"], ["overview", "tourism", "environment"]),
        ],
      },
      {
        id: "suyeong",
        type: "district",
        title: "수영구",
        summary: "광안대교와 주거의 조화 지역",
        image: cityImage("SUYEONG", ["#173e78", "#d1895c"]),
        categoryIcons: ["overview", "tourism", "housing", "environment"],
        detail: details("부산광역시", "자치구", "10.21㎢", "174,000명", "10개 동", "1995년 3월 1일", "광안리 해변과 주거 지역이 조화를 이루는 해양도시입니다.", ["해안선 8.2km", "도시공원 32곳"], ["수영구청", "수영문화원"]),
        children: [
          leaf("gwangan", "광안동", "광안리 해변의 문화 생활권", "수영구", ["#183c71", "#df9b70"], ["overview", "tourism", "culture", "housing"]),
        ],
      },
      {
        id: "dongnae",
        type: "district",
        title: "동래구",
        summary: "역사와 전통이 살아있는 지역",
        image: cityImage("DONGNAE", ["#67482c", "#d2a873"]),
        categoryIcons: ["overview", "culture", "education", "housing"],
        detail: details("부산광역시", "자치구", "16.63㎢", "271,000명", "13개 동", "1957년 1월 1일", "온천과 역사 유산, 교육 환경이 어우러진 지역입니다.", ["학교 51곳", "문화재 24건"], ["동래구청", "동래문화회관"]),
        children: [],
      },
      {
        id: "namgu",
        type: "district",
        title: "남구",
        summary: "산업·주거·해양의 복합 지역",
        image: cityImage("NAMGU", ["#356178", "#79b8b2"]),
        categoryIcons: ["overview", "economy", "education", "housing"],
        detail: details("부산광역시", "자치구", "26.82㎢", "256,000명", "17개 동", "1975년 10월 1일", "항만 배후 산업과 대학, 주거 기능이 공존합니다.", ["대학 4곳", "산업단지 2곳"], ["남구청", "부산박물관"]),
        children: [],
      },
      {
        id: "yeonje",
        type: "district",
        title: "연제구",
        summary: "교육·행정·주거의 균형 발전 지역",
        image: cityImage("YEONJE", ["#4a6b58", "#b7c695"]),
        categoryIcons: ["overview", "administration", "education", "housing"],
        detail: details("부산광역시", "자치구", "12.10㎢", "207,000명", "12개 동", "1995년 3월 1일", "부산시청을 중심으로 행정과 주거 기능이 발달한 지역입니다.", ["공공기관 34곳", "학교 29곳"], ["연제구청", "부산광역시청"]),
        children: [],
      },
      {
        id: "sasang",
        type: "district",
        title: "사상구",
        summary: "물류·산업의 서부 거점 지역",
        image: cityImage("SASANG", ["#4e5867", "#a9b9c8"]),
        categoryIcons: ["overview", "economy", "traffic", "environment"],
        detail: details("부산광역시", "자치구", "36.09㎢", "205,000명", "12개 동", "1995년 3월 1일", "산업단지와 광역 교통망을 갖춘 서부산의 중심지입니다.", ["산업체 3,600여 곳", "광역 환승거점 2곳"], ["사상구청", "부산산업용품유통단지"]),
        children: [],
      },
    ],
  },
];

export const flattenCityTree = (roots = cityTreeRoots) => {
  const result = [];
  const visit = (node, parentId = null, rootId = node.id, depth = 0) => {
    result.push({ ...node, parentId, rootId, depth });
    node.children.forEach((child) => visit(child, node.id, rootId, depth + 1));
  };
  roots.forEach((root) => visit(root));
  return result;
};

export const cityTreeNodes = flattenCityTree();
export const cityTreeNodeById = Object.fromEntries(cityTreeNodes.map((node) => [node.id, node]));
