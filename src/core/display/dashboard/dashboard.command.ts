import { defineTagged, type TaggedUnionOf } from '@core/common/entities/tagged';

export const DashboardCommand = defineTagged({
  getInvestigators: () => ({}),
  noop: () => ({}),
});

export type DashboardCommands = TaggedUnionOf<typeof DashboardCommand>;
