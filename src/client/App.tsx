import { CHARACTERISTICS } from '@game-rules/index';
import { Card, Flex, Input, Layout, Tag, Typography } from 'antd';
import { useCharacterStore } from './providers/CharacterStoreProvider';

export function App() {
  const name = useCharacterStore((state) => state.name);
  const setName = useCharacterStore((state) => state.setName);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Content style={{ padding: 24, maxWidth: 720, width: '100%', margin: '0 auto' }}>
        <Typography.Title level={2}>Call of Cthulhu 7e — Character Creation</Typography.Title>
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
      </Layout.Content>
    </Layout>
  );
}
