import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Content } from './Content';

describe('Content', () => {
  it('renders its children', () => {
    render(
      <Content>
        <p>First</p>
        <p>Second</p>
      </Content>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
