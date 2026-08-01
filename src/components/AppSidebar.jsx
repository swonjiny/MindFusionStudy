/**
 * [프로젝트 구조 안내] 01~19 학습 목차를 검색하고 선택하는 왼쪽 메뉴입니다.
 * lessonMenus.js의 원본 데이터를 검색어에 맞게 걸러 Ant Design Menu 형식으로 변환합니다.
 * 메뉴 선택 시 lesson 객체를 직접 수정하지 않고 부모의 onSelect 콜백에 key만 전달합니다.
 */
import { useMemo, useState } from "react";
import { Input, Menu, Progress, Tag, Typography } from "antd";
import {
  CheckCircleFilled,
  LockOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { categories, lessons } from "../data/lessonMenus";

export default function AppSidebar({ selectedKey, onSelect, progress }) {
  const [query, setQuery] = useState("");
  const [openKeys, setOpenKeys] = useState(["01", "02"]);

  const menuItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return categories
      .map((category) => {
        const children = lessons.filter(
          (lesson) =>
            lesson.category === category.key &&
            (!normalized ||
              lesson.title.toLowerCase().includes(normalized) ||
              lesson.key.includes(normalized) ||
              category.title.toLowerCase().includes(normalized)),
        );
        if (normalized && children.length === 0) return null;
        const ready = children.some((lesson) => lesson.status === "ready");
        return {
          key: category.key,
          label: (
            <span className="category-label">
              <span>{category.key}. {category.title}</span>
              {ready ? <CheckCircleFilled className="ready-icon" /> : <LockOutlined />}
            </span>
          ),
          children: children.map((lesson) => ({
            key: lesson.key,
            disabled: false,
            label: (
              <span className="lesson-menu-label">
                <span>{lesson.key} {lesson.shortTitle}</span>
                {lesson.status === "planned" && <Tag>준비 중</Tag>}
              </span>
            ),
          })),
        };
      })
      .filter(Boolean);
  }, [query]);

  return (
    <aside className="app-sidebar" data-testid="learning-menu">
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="메뉴 검색..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="sidebar-progress">
        <div>
          <Typography.Text strong>학습 목차</Typography.Text>
          <Typography.Text type="secondary">진도율: {progress}%</Typography.Text>
        </div>
        <Progress percent={progress} showInfo={false} size="small" />
      </div>
      <Menu
        mode="inline"
        items={menuItems}
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        onSelect={({ key }) => onSelect(key)}
      />
    </aside>
  );
}
