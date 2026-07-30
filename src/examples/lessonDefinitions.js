import {
  Alignment,
  ArrowHeads,
  FitSize,
  LinkShape,
  ShapeNode,
} from "@mindfusion/diagramming";
import { DashStyle, Font, Rect, Thickness } from "@mindfusion/drawing";

function styleNode(node, options = {}) {
  node.text = options.text ?? "일반 노드";
  node.brush = options.brush ?? "#e8f3ff";
  node.stroke = options.stroke ?? "#2877de";
  node.strokeThickness = options.strokeThickness ?? 1.6;
  node.textColor = options.textColor ?? "#172033";
  node.fontSize = options.fontSize ?? 11;
  node.textAlignment = options.textAlignment ?? Alignment.Center;
  node.lineAlignment = options.lineAlignment ?? Alignment.Center;
  if (options.font) node.font = options.font;
  if (options.textPadding) node.textPadding = options.textPadding;
  if (options.textStroke) node.textStroke = options.textStroke;
  if (options.textStrokeThickness !== undefined) node.textStrokeThickness = options.textStrokeThickness;
  if (options.clipText !== undefined) node.clipText = options.clipText;
  if (options.strokeDashStyle !== undefined) {
    node.strokeDashStyle = options.strokeDashStyle;
  }
  return node;
}

function linkNodes(diagram, origin, destination, options = {}) {
  const link = diagram.factory.createDiagramLink(origin, destination);
  link.text = options.text ?? "";
  link.stroke = options.stroke ?? "#4e6b95";
  link.strokeThickness = options.strokeThickness ?? 2;
  if (options.strokeDashStyle !== undefined) link.strokeDashStyle = options.strokeDashStyle;
  if (options.shape !== undefined) link.shape = options.shape;
  if (options.headShape !== undefined) link.headShape = options.headShape;
  if (options.headShapeSize !== undefined) link.headShapeSize = options.headShapeSize;
  return link;
}

function factoryNode(diagram, bounds, options) {
  return styleNode(
    diagram.factory.createShapeNode(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
    ),
    options,
  );
}

function directNode(diagram, bounds, options) {
  const node = styleNode(new ShapeNode(diagram), options);
  node.bounds = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
  diagram.addItem(node);
  return node;
}

export function buildLessonDiagram(diagram, lessonKey) {
  diagram.clearAll();
  diagram.backBrush = lessonKey === "01-01" ? "#f1f7ff" : "#ffffff";

  switch (lessonKey) {
    case "01-01":
    case "01-02":
    case "01-03":
      return [];
    case "02-01":
      return [
        directNode(diagram, { x: 55, y: 42, width: 55, height: 28 }, {
          text: "일반 노드",
        }),
      ];
    case "02-02":
      return [
        directNode(diagram, { x: 25, y: 34, width: 48, height: 26 }, {
          text: "첫 번째 노드",
          brush: "#e8f3ff",
          stroke: "#2877de",
        }),
        directNode(diagram, { x: 95, y: 34, width: 48, height: 26 }, {
          text: "두 번째 노드",
          brush: "#f2eaff",
          stroke: "#7a4bd8",
        }),
      ];
    case "02-03":
      return [
        factoryNode(diagram, { x: 55, y: 42, width: 58, height: 28 }, {
          text: "Factory 생성",
          brush: "#e8f8ef",
          stroke: "#289766",
        }),
      ];
    case "02-04":
      return [
        directNode(diagram, { x: 55, y: 42, width: 58, height: 28 }, {
          text: "직접 생성",
          brush: "#fff3df",
          stroke: "#d98719",
        }),
      ];
    case "02-05":
      return [
        factoryNode(diagram, { x: 24, y: 42, width: 55, height: 28 }, {
          text: "Factory 생성",
          brush: "#e8f8ef",
          stroke: "#289766",
        }),
        directNode(diagram, { x: 92, y: 42, width: 55, height: 28 }, {
          text: "직접 생성",
          brush: "#fff3df",
          stroke: "#d98719",
        }),
      ];
    case "02-06":
      return [
        directNode(diagram, { x: 38, y: 34, width: 55, height: 28 }, {
          text: "위치 변경",
        }),
      ];
    case "02-07":
      return [
        directNode(diagram, { x: 50, y: 40, width: 55, height: 28 }, {
          text: "크기 변경",
        }),
      ];
    case "02-08":
      return [
        directNode(diagram, { x: 48, y: 38, width: 68, height: 32 }, {
          text: "한글 텍스트",
          textColor: "#1456b8",
          fontSize: 14,
          brush: "#eef6ff",
        }),
      ];
    case "02-09":
      return [
        directNode(diagram, { x: 45, y: 30, width: 75, height: 48 }, {
          text: "첫 번째 줄\n두 번째 줄\n세 번째 줄",
          fontSize: 12,
          brush: "#f4f0ff",
          stroke: "#7950c7",
        }),
      ];
    case "02-10":
      return [
        directNode(diagram, { x: 18, y: 34, width: 45, height: 38 }, {
          text: "왼쪽 / 위",
          textAlignment: Alignment.Near,
          lineAlignment: Alignment.Near,
        }),
        directNode(diagram, { x: 68, y: 34, width: 45, height: 38 }, {
          text: "가운데",
          textAlignment: Alignment.Center,
          lineAlignment: Alignment.Center,
          brush: "#e8f8ef",
          stroke: "#289766",
        }),
        directNode(diagram, { x: 118, y: 34, width: 45, height: 38 }, {
          text: "오른쪽 / 아래",
          textAlignment: Alignment.Far,
          lineAlignment: Alignment.Far,
          brush: "#fff3df",
          stroke: "#d98719",
        }),
      ];
    case "02-11":
      return ["기본", "성공", "주의"].map((text, index) =>
        directNode(diagram, { x: 18 + index * 52, y: 40, width: 44, height: 28 }, {
          text,
          brush: ["#e8f3ff", "#e8f8ef", "#fff4dc"][index],
          stroke: ["#2877de", "#289766", "#d98719"][index],
        }),
      );
    case "02-12":
      return [
        directNode(diagram, { x: 18, y: 40, width: 44, height: 28 }, {
          text: "기본",
          stroke: "#2877de",
          strokeThickness: 1,
          strokeDashStyle: DashStyle.Solid,
        }),
        directNode(diagram, { x: 70, y: 40, width: 44, height: 28 }, {
          text: "굵은 선",
          stroke: "#7a4bd8",
          strokeThickness: 3,
          strokeDashStyle: DashStyle.Solid,
          brush: "#f4f0ff",
        }),
        directNode(diagram, { x: 122, y: 40, width: 44, height: 28 }, {
          text: "점선",
          stroke: "#d97706",
          strokeThickness: 2,
          strokeDashStyle: DashStyle.Dash,
          brush: "#fff4dc",
        }),
      ];
    case "03-01":
      return [
        directNode(diagram, { x: 22, y: 35, width: 60, height: 38 }, {
          text: "기본 여백",
          textAlignment: Alignment.Near,
          lineAlignment: Alignment.Near,
          textPadding: new Thickness(2),
        }),
        directNode(diagram, { x: 100, y: 35, width: 60, height: 38 }, {
          text: "넓은 여백",
          textAlignment: Alignment.Near,
          lineAlignment: Alignment.Near,
          textPadding: new Thickness(10, 8, 10, 8),
          brush: "#f4f0ff",
          stroke: "#7950c7",
        }),
      ];
    case "03-02":
      return [
        directNode(diagram, { x: 25, y: 36, width: 62, height: 34 }, {
          text: "Regular 12",
          font: new Font("Arial", 12),
        }),
        directNode(diagram, { x: 100, y: 36, width: 62, height: 34 }, {
          text: "Bold 16",
          font: new Font("Arial", 16, true),
          brush: "#e8f8ef",
          stroke: "#289766",
        }),
      ];
    case "03-03":
      return [
        directNode(diagram, { x: 22, y: 36, width: 62, height: 34 }, {
          text: "기본 텍스트",
          fontSize: 14,
        }),
        directNode(diagram, { x: 100, y: 36, width: 62, height: 34 }, {
          text: "외곽선 텍스트",
          fontSize: 14,
          textColor: "#ffffff",
          textStroke: "#274c77",
          textStrokeThickness: 1,
          brush: "#8fb8de",
          stroke: "#274c77",
        }),
      ];
    case "03-04":
      return [
        directNode(diagram, { x: 18, y: 35, width: 65, height: 36 }, {
          text: "잘리는 아주 긴 노드 텍스트 예제입니다",
          clipText: true,
          brush: "#fff4dc",
          stroke: "#d98719",
        }),
        directNode(diagram, { x: 105, y: 35, width: 65, height: 36 }, {
          text: "줄바꿈으로 표시되는 아주 긴 텍스트",
          clipText: false,
          brush: "#e8f8ef",
          stroke: "#289766",
        }),
      ];
    case "03-05": {
      const fixed = directNode(diagram, { x: 18, y: 36, width: 55, height: 32 }, {
        text: "고정 크기",
      });
      const fitted = directNode(diagram, { x: 96, y: 36, width: 42, height: 32 }, {
        text: "텍스트 길이에 맞춘 노드",
        brush: "#f4f0ff",
        stroke: "#7950c7",
      });
      fitted.resizeToFitText(FitSize.KeepHeight);
      return [fixed, fitted];
    }
    case "04-01":
    case "04-02":
    case "04-05":
      return [
        directNode(diagram, { x: 28, y: 36, width: 56, height: 34 }, { text: "노드 A" }),
        directNode(diagram, { x: 104, y: 36, width: 56, height: 34 }, {
          text: "노드 B", brush: "#f4f0ff", stroke: "#7950c7",
        }),
      ];
    case "04-03":
    case "04-04":
      diagram.allowMultipleSelection = true;
      return ["노드 A", "노드 B", "노드 C"].map((text, index) =>
        directNode(diagram, { x: 15 + index * 58, y: 36, width: 48, height: 34 }, {
          text,
          brush: ["#e8f3ff", "#e8f8ef", "#fff4dc"][index],
          stroke: ["#2877de", "#289766", "#d98719"][index],
        }),
      );
    case "05-01": {
      const a = directNode(diagram, { x: 20, y: 38, width: 48, height: 30 }, { text: "시작" });
      const b = directNode(diagram, { x: 120, y: 38, width: 48, height: 30 }, { text: "도착" });
      linkNodes(diagram, a, b);
      return [a, b];
    }
    case "05-02": {
      const nodes = ["입력", "처리", "출력"].map((text, index) =>
        directNode(diagram, { x: 10 + index * 70, y: 38, width: 45, height: 30 }, { text }),
      );
      linkNodes(diagram, nodes[0], nodes[1]);
      linkNodes(diagram, nodes[1], nodes[2]);
      return nodes;
    }
    case "05-03": {
      const a = directNode(diagram, { x: 18, y: 38, width: 52, height: 30 }, { text: "주문" });
      const b = directNode(diagram, { x: 120, y: 38, width: 52, height: 30 }, { text: "결제" });
      linkNodes(diagram, a, b, { text: "승인 요청", stroke: "#2877de" });
      return [a, b];
    }
    case "05-04": {
      const a = directNode(diagram, { x: 18, y: 38, width: 52, height: 30 }, { text: "출발" });
      const b = directNode(diagram, { x: 120, y: 38, width: 52, height: 30 }, { text: "도착" });
      linkNodes(diagram, a, b, { headShape: ArrowHeads.Triangle(), headShapeSize: 5, stroke: "#d04f4f" });
      return [a, b];
    }
    case "05-05": {
      const a = directNode(diagram, { x: 12, y: 28, width: 45, height: 28 }, { text: "시작" });
      const b = directNode(diagram, { x: 80, y: 55, width: 45, height: 28 }, { text: "분기" });
      const c = directNode(diagram, { x: 148, y: 28, width: 45, height: 28 }, { text: "완료" });
      linkNodes(diagram, a, b, { text: "Bezier", shape: LinkShape.Bezier, stroke: "#2877de" });
      linkNodes(diagram, b, c, {
        text: "Cascading",
        shape: LinkShape.Cascading,
        stroke: "#d97706",
        strokeDashStyle: DashStyle.Dash,
        headShape: ArrowHeads.Triangle(),
      });
      return [a, b, c];
    }
    default:
      return [];
  }
}
