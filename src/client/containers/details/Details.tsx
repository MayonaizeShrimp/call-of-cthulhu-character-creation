import { Content } from '@client/components/Content';
import { useCharacterStore } from '@client/providers/CharacterStoreProvider';
import { CHARACTERISTICS } from '@game-rules/index';
import { Card, Flex, Input, Tag, Typography } from 'antd';
import { Link, useParams } from 'react-router';

export function Details() {
  // No id in the URL means we're creating a new investigator.
  const { id } = useParams();
  const name = useCharacterStore((state) => state.name);
  const setName = useCharacterStore((state) => state.setName);

  return (
    <Content>
      <Link to="/">Back to dashboard</Link>
      <Typography.Title level={3}>
        {id === undefined ? 'New investigator' : `Investigator ${id}`}
      </Typography.Title>
      <Card title={`Hello, ${name || 'Investigator'}`}>
        <Flex vertical gap="middle">
          <Input
            aria-label="Investigator name"
            placeholder="Investigator name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Flex wrap gap="small">
            {CHARACTERISTICS.map((characteristic) => (
              <Tag key={characteristic}>{characteristic}</Tag>
            ))}
          </Flex>
        </Flex>
      </Card>
    </Content>
  );
}
