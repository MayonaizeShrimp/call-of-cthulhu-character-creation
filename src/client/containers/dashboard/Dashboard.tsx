import { Button, Empty, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <Flex vertical gap="middle">
      <Typography.Title level={3}>Investigators</Typography.Title>
      <Empty description="No investigators yet" />
      <Button type="primary" block onClick={() => navigate('/investigators')}>
        Create investigator
      </Button>
    </Flex>
  );
}
