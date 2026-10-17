import { Button, Typography } from 'antd';
import type { FC } from 'react';
import { StyledNavbar } from './Navbar.styles';

type NavbarProps = {
  title: string;
  cta: {
    label: string;
    onClick: () => void;
  };
};

export const Navbar: FC<NavbarProps> = ({ title, cta }) => {
  return (
    <StyledNavbar justify="space-between">
      <Typography.Title level={3}>{title}</Typography.Title>
      <Button onClick={cta.onClick} type="primary">
        {cta.label}
      </Button>
    </StyledNavbar>
  );
};
