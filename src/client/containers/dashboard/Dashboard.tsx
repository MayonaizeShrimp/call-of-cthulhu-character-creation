import { Content } from '@client/components/Content';
import { Navbar } from '@client/components/Navbar';
import { Button, Empty, Typography } from 'antd';
import { useNavigate } from 'react-router';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        title={''}
        cta={{
          label: 'New Investigator',
          onClick: () => navigate('/investigator'),
        }}
      />
      <Content>
        <Typography.Title level={3}>Investigators</Typography.Title>
        <Empty description="No investigators yet" />
        <Button type="primary" block onClick={() => navigate('/investigators')}>
          Create investigator
        </Button>
      </Content>
    </>
  );
}
