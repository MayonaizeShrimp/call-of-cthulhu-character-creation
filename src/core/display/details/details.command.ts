import { defineTagged, type TaggedUnionOf } from '@core/common/entities/tagged';
import type { InvestigatorData } from '@core/rules';

export const DetailsCommand = defineTagged({
  loadInvestigator: (id: string) => ({ id }),
  // Without an id, a new investigator is created.
  saveInvestigator: (investigator: InvestigatorData & { id?: string }) => ({ investigator }),
  noop: () => ({}),
});

export type DetailsCommands = TaggedUnionOf<typeof DetailsCommand>;
