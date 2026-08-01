import { Button, Result, Tag, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";

export default function PlannedLesson({ lesson, onBack }) {
  return (
    <div data-testid="planned-lesson">
      <Result
        icon={<LockOutlined />}
        title={`${lesson.category}. ${lesson.title}`}
        subTitle="이 항목은 전체 학습 경로를 안내하기 위한 시작 메뉴입니다. 예제 학습은 01부터 순서대로 진행할 수 있습니다."
        extra={<Button type="primary" onClick={onBack}>구현된 예제로 돌아가기</Button>}
      />
      <div className="planned-note">
        <Tag>학습 안내</Tag>
        <Typography.Text>
          현재 01부터 19까지의 단계별 예제와 최종 종합 예제가 구현되어 있습니다.
        </Typography.Text>
      </div>
    </div>
  );
}
