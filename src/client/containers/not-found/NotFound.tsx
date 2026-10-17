import { Content } from '@client/components/Content';
import { Result } from 'antd';
import { Link } from 'react-router';

export function NotFound() {
  return (
    <Content>
      <Result status="404" title="Page not found" extra={<Link to="/">Back to dashboard</Link>} />
    </Content>
  );
}
