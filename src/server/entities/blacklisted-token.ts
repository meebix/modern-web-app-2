import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

@Entity('blacklisted_token')
export class BlacklistedToken extends BaseTable {
  @Column('character varying')
  public token: string;
}
