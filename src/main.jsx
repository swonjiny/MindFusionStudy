/**
 * [프로젝트 구조 안내] 브라우저가 가장 먼저 실행하는 진입 파일입니다.
 * index.html의 #root 요소를 찾고, 그 안에 최상위 App 컴포넌트를 렌더링합니다.
 * ConfigProvider는 Ant Design의 한국어 문구와 공통 테마를 모든 하위 화면에 전달합니다.
 * 화면 기능을 추가할 때는 보통 이 파일이 아니라 App.jsx 또는 해당 컴포넌트를 수정합니다.
 */
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";
import App from "./App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider
    locale={koKR}
    theme={{
      token: {
        colorPrimary: "#2468d6",
        borderRadius: 8,
        colorText: "#172033",
        fontFamily:
          "Pretendard, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },
    }}
  >
    <App />
  </ConfigProvider>,
);
