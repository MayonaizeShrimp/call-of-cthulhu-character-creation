import type { FC, PropsWithChildren } from 'react';
import { StyledContent } from './Content.styles';

export const Content: FC<PropsWithChildren> = ({ children }) => {
  return (
    <StyledContent vertical gap="middle">
      {children}
    </StyledContent>
  );
};
