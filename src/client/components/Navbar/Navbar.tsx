import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import type { FC } from 'react';
import { NavbarTitle, StyledNavbar } from './Navbar.styles';

type NavbarProps = {
  title: string;
  onBack?: () => void;
  cta?: {
    label: string;
    onClick: () => void;
  };
};

export const Navbar: FC<NavbarProps> = ({ title, onBack, cta }) => {
  return (
    <StyledNavbar justify="space-between" align="center" gap="small">
      <Flex align="center" gap="small">
        {onBack && (
          <Button aria-label="Go back" icon={<ArrowLeftOutlined />} type="text" onClick={onBack} />
        )}
        <NavbarTitle level={3} ellipsis>
          {title}
        </NavbarTitle>
      </Flex>
      {cta && (
        <Button onClick={cta.onClick} type="primary">
          {cta.label}
        </Button>
      )}
    </StyledNavbar>
  );
};
