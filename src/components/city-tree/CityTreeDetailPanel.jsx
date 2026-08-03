import { Button, Descriptions, Divider, Empty, Tag, Typography } from "antd";
import { CloseOutlined, ExportOutlined } from "@ant-design/icons";

export default function CityTreeDetailPanel({ node, onClose }) {
  if (!node) {
    return (
      <aside className="city-detail-panel" data-testid="city-tree-detail-panel">
        <div className="city-detail-panel-title"><span>선택 노드 상세 정보</span></div>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="도시 노드를 선택하세요" />
      </aside>
    );
  }
  const detail = node.detail;
  return (
    <aside className="city-detail-panel" data-testid="city-tree-detail-panel">
      <div className="city-detail-panel-title">
        <span>선택 노드 상세 정보</span>
        <Button type="text" size="small" icon={<CloseOutlined />} aria-label="상세 패널 닫기" onClick={onClose} />
      </div>
      <Typography.Title level={4}>{node.title}</Typography.Title>
      <img className="city-detail-hero" src={node.image} alt={`${node.title} 대표 이미지`} />
      <Descriptions
        size="small"
        column={1}
        items={[
          { key: "parent", label: "상위 노드", children: detail.parentTitle },
          { key: "type", label: "유형", children: detail.type },
          { key: "area", label: "면적", children: detail.area },
          { key: "population", label: "인구", children: detail.population },
          { key: "administrativeAreas", label: "행정구역", children: detail.administrativeAreas },
          { key: "establishedAt", label: "설립일/기준일", children: detail.establishedAt },
          { key: "description", label: "설명", children: detail.description },
        ]}
      />
      <Divider titlePlacement="start">주요 지표</Divider>
      <div className="city-indicator-list">{detail.indicators.map((item) => <Tag key={item}>{item}</Tag>)}</div>
      <Divider titlePlacement="start">주요 기관</Divider>
      <div className="city-institution-list">{detail.institutions.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</div>)}</div>
      <Button
        block
        type="primary"
        ghost
        icon={<ExportOutlined />}
        href={detail.detailUrl === "#" ? undefined : detail.detailUrl}
        target={detail.detailUrl === "#" ? undefined : "_blank"}
        rel="noreferrer"
      >상세 정보 페이지 열기</Button>
    </aside>
  );
}
