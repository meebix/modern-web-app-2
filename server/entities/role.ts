import { Entity, Column } from 'typeorm';
import { BaseTable } from './base-table';

interface Permission {
  key?: string;
}

interface ProhibitedRoutes {
  paths?: string[];
}

export enum RoleName {
  ADMIN = 'admin',
  ACTOR = 'actor',
}

@Entity('role')
export class Role extends BaseTable {
  @Column('enum', { enum: RoleName, default: RoleName.ACTOR })
  public name!: RoleName;

  @Column('varchar', { array: true, nullable: true })
  public permissions!: Permission[];

  @Column('jsonb', { name: 'prohibited_routes', nullable: true })
  public prohibitedRoutes!: ProhibitedRoutes;
}