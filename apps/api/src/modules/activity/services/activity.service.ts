import { Injectable } from '@nestjs/common';
import type { EntityManager } from 'typeorm';
import type {
  ActivityAction,
  ActivityTargetType,
} from '../constants/activity.constants';
import { Activity } from '../entities/activity.entity';

export type ActivityRecord = {
  orgId: string;
  userId: string;
  action: ActivityAction;
  targetType: ActivityTargetType;
  targetId: string;
  targetName: string;
};

@Injectable()
export class ActivityService {
  async record(manager: EntityManager, record: ActivityRecord): Promise<void> {
    await manager.save(manager.create(Activity, record));
  }
}
