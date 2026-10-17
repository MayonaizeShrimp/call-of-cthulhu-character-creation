import { Content } from '@client/components/Content';
import { Result } from 'antd';
import type { FC } from 'react';
import { Link } from 'react-router';

export const NotFound: FC = () => {
  return (
    <Content>
      <Result status="404" title="Page not found" extra={<Link to="/">Back to dashboard</Link>} />
    </Content>
  );
};
