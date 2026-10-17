import { Content } from '@client/components/Content';
import { Navbar } from '@client/components/Navbar';
import {
  DashboardStoreProvider,
  useDashboardDispatch,
  useDashboardState,
} from '@client/providers/DashboardStoreProvider';
import { DashboardCommand } from '@core/display/dashboard';
import { Button, Card, Empty, Spin, Typography } from 'antd';
import { type FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDashboardEffects } from './Dashboard.effect';

export const Dashboard: FC = () => (
  <DashboardStoreProvider>
    <DashboardPage />
  </DashboardStoreProvider>
);

const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const investigators = useDashboardState((state) => state.investigators);
  const isLoading = useDashboardState(
    (state) => state.command.type === DashboardCommand.getInvestigators.type,
  );
  const dispatch = useDashboardDispatch();

  useDashboardEffects();

  useEffect(() => {
    dispatch.startGetInvestigators();
  }, []);

  return (
    <>
      <Navbar
        title={''}
        cta={{
          label: 'New Investigator',
          onClick: () => navigate('/investigators'),
        }}
      />
      <Content>
        <Typography.Title level={3}>Investigators</Typography.Title>
        {isLoading ? (
          <Spin />
        ) : investigators.length === 0 ? (
          <Empty description="No investigators yet" />
        ) : (
          investigators.map((investigator) => (
            <Link key={investigator.id} to={`/investigators/${investigator.id}`}>
              <Card hoverable size="small">
                {investigator.name}
              </Card>
            </Link>
          ))
        )}
        <Button type="primary" block onClick={() => navigate('/investigators')}>
          Create investigator
        </Button>
      </Content>
    </>
  );
};
