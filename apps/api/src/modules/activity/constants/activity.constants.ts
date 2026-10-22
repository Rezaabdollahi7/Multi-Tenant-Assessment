export const ActivityActions = {
  FINDING_CREATED: 'finding.created',
  FINDING_UPDATED: 'finding.updated',
  FINDING_DELETED: 'finding.deleted',
} as const;

export const ACTIVITY_ACTIONS = Object.values(ActivityActions);
export type ActivityAction = (typeof ACTIVITY_ACTIONS)[number];

export const ActivityTargetTypes = {
  FINDING: 'finding',
} as const;

export const ACTIVITY_TARGET_TYPES = Object.values(ActivityTargetTypes);
export type ActivityTargetType = (typeof ACTIVITY_TARGET_TYPES)[number];
