import { defineTagged, type TaggedUnionOf } from '@core/common/entities/tagged';
import type { Investigator } from '@game-rules/index';

export const DashboardAction = defineTagged({
  startGetInvestigators: () => ({}),
  finishGetInvestigators: (investigators: Investigator[]) => ({ investigators }),
  resetCommand: () => ({}),
});

export type DashboardActions = TaggedUnionOf<typeof DashboardAction>;
