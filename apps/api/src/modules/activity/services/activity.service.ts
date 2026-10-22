import { Activity } from '../entities/activity.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';

export type ActivityRecordDto = {
  orgId: string;
  userId: string;
  action: string;
  targetType: string;
  targetId: string;
  targetName?: string | null;
};

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
  ) {}

  async record(
    data: ActivityRecordDto,
    manager?: EntityManager,
  ): Promise<Activity> {
    const repo = manager ? manager.getRepository(Activity) : this.repository;
    const entity = repo.create(data as DeepPartial<Activity>);
    return repo.save(entity);
  }
}
