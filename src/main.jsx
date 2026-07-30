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
