import { describe, expect, it } from 'vitest';
import { bindTagged, defineTagged } from './tagged';

const Example = defineTagged({
  reset: () => ({}),
  add: (amount: number) => ({ amount }),
  sneaky: () => ({ type: 'overridden' }),
});

describe('defineTagged', () => {
  it('creates tagged values with their payload', () => {
    expect(Example.reset()).toEqual({ type: 'reset' });
    expect(Example.add(3)).toEqual({ type: 'add', amount: 3 });
  });

  it('exposes each tag as .type', () => {
    expect(Example.reset.type).toBe('reset');
    expect(Example.add.type).toBe('add');
  });

  it('does not let a payload override the tag', () => {
    expect(Example.sneaky().type).toBe('sneaky');
  });
});

describe('bindTagged', () => {
  it('creates the value and passes it to dispatch', () => {
    const dispatched: unknown[] = [];
    const bound = bindTagged(Example, (value) => dispatched.push(value));

    bound.add(2);
    bound.reset();

    expect(dispatched).toEqual([Example.add(2), Example.reset()]);
  });
});
