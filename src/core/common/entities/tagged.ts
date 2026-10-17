type PayloadFactories = Record<string, (...args: never[]) => object>;

export type TaggedCreators<F extends PayloadFactories> = {
  [K in keyof F & string]: ((...args: Parameters<F[K]>) => { type: K } & ReturnType<F[K]>) & {
    readonly type: K;
  };
};

/** Union of everything the creators produce, e.g. `DashboardActions`. */
export type TaggedUnionOf<C> = {
  [K in keyof C]: C[K] extends (...args: never[]) => infer R ? R : never;
}[keyof C];

/**
 * Builds tagged creators from payload factories; each key becomes the `type`:
 * `defineTagged({ add: (n: number) => ({ n }) }).add(1)` → `{ type: 'add', n: 1 }`,
 * and `.add.type === 'add'` for pattern matching.
 */
export const defineTagged = <F extends PayloadFactories>(factories: F): TaggedCreators<F> =>
  Object.fromEntries(
    Object.entries(factories).map(([type, factory]) => [
      type,
      Object.assign((...args: never[]) => ({ ...factory(...args), type }), { type }),
    ]),
    // fromEntries loses the per-key types; the mapping above builds exactly TaggedCreators<F>.
  ) as unknown as TaggedCreators<F>;

type Creators = Record<string, (...args: never[]) => object>;

/** Creators bound to a dispatch function: calling one creates the value and dispatches it. */
export type BoundTagged<C extends Creators> = {
  [K in keyof C]: (...args: Parameters<C[K]>) => void;
};

/**
 * `bindTagged(DashboardAction, dispatch).finishGetInvestigators(list)`
 * is `dispatch(DashboardAction.finishGetInvestigators(list))`.
 */
export const bindTagged = <C extends Creators>(
  creators: C,
  dispatch: (value: TaggedUnionOf<C>) => void,
): BoundTagged<C> =>
  Object.fromEntries(
    Object.entries(creators).map(([name, create]) => [
      name,
      (...args: never[]) => dispatch(create(...args) as TaggedUnionOf<C>),
    ]),
  ) as unknown as BoundTagged<C>;
