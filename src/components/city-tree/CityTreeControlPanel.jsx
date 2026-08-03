import { Alert, Button, Select, Space, Tag, Typography } from "antd";
import {
  ApartmentOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import CityTreeExternalIcons, { categoryMeta } from "./CityTreeExternalIcons";

export default function CityTreeControlPanel({ selectedRootId, onSelectedRootChange, onExpandAll, onCollapseAll, onExpandRoot, onCollapseRoot, compact = false }) {
  const allCategories = Object.keys(categoryMeta);
  return (
    <aside className={`city-control-panel ${compact ? "is-compact" : ""}`} data-testid="city-tree-control-panel">
      <div className="city-panel-heading">
        <Tag color="blue">시안 1</Tag>
        <div>
          <Typography.Title level={4}>도시 정보 트리</Typography.Title>
          <Typography.Paragraph>국가·광역·기초 단위의 도시 정보를 계층 구조로 탐색합니다.</Typography.Paragraph>
        </div>
      </div>

      <Typography.Text className="city-panel-label" strong>트리 제어</Typography.Text>
      <Space orientation="vertical" size={8} style={{ width: "100%" }}>
        <Button data-testid="city-expand-all" icon={<ArrowDownOutlined />} block onClick={onExpandAll}>전체 열기</Button>
        <Button data-testid="city-collapse-all" icon={<ArrowUpOutlined />} block onClick={onCollapseAll}>전체 닫기</Button>
        <Button data-testid="city-expand-root" icon={<ApartmentOutlined />} block onClick={onExpandRoot}>선택 루트 열기</Button>
        <Button data-testid="city-collapse-root" icon={<ApartmentOutlined />} block onClick={onCollapseRoot}>선택 루트 닫기</Button>
      </Space>

      <Typography.Text className="city-panel-label" strong>루트 선택</Typography.Text>
      <Select
        aria-label="루트 선택"
        data-testid="city-tree-root-select"
        value={selectedRootId}
        onChange={onSelectedRootChange}
        options={[
          { value: "seoul", label: <span><EnvironmentOutlined /> 서울특별시</span> },
          { value: "busan", label: <span><EnvironmentOutlined /> 부산광역시</span> },
        ]}
        style={{ width: "100%" }}
      />

      <Typography.Text className="city-panel-label" strong>아이콘 설명</Typography.Text>
      <CityTreeExternalIcons categories={allCategories} />

      <Alert
        showIcon
        type="info"
        title="사용 안내"
        description="카드를 클릭해 선택하고 ‘상세정보 보기’로 확장하세요. 테두리 아래 아이콘에 마우스를 올리면 분류를 확인할 수 있습니다."
      />
    </aside>
  );
}
