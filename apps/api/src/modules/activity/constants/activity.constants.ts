export const ActivityActions = {
  FINDING_CREATED: 'finding.created',
  FINDING_UPDATED: 'finding.updated',
  FINDING_DELETED: 'finding.deleted',
} as const;

export type ActivityAction =
  (typeof ActivityActions)[keyof typeof ActivityActions];

export const ActivityTargetTypes = {
  FINDING: 'finding',
} as const;

export type ActivityTargetType =
  (typeof ActivityTargetTypes)[keyof typeof ActivityTargetTypes];
