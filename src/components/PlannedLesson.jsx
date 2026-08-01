import { Button, Result, Tag, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";

export default function PlannedLesson({ lesson, onBack }) {
  return (
    <div data-testid="planned-lesson">
      <Result
        icon={<LockOutlined />}
        title={`${lesson.category}. ${lesson.title}`}
        subTitle="이 메뉴는 전체 학습 경로를 보여주기 위한 준비 중 항목입니다. 요청된 3차 구현 범위에는 포함되지 않습니다."
        extra={<Button type="primary" onClick={onBack}>구현된 예제로 돌아가기</Button>}
      />
      <div className="planned-note">
        <Tag>다음 개발 단계</Tag>
        <Typography.Text>
          사용자 지시 없이 09 이후 HTML 노드와 카드 기능을 구현하지 않습니다.
        </Typography.Text>
      </div>
    </div>
  );
}
