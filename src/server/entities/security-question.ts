import { Entity, Column } from 'typeorm';
import { BaseTable } from './partials/base-table';

@Entity('security_question')
export class SecurityQuestion extends BaseTable {
  @Column('character varying', { unique: true })
  public short_name: string;

  @Column('text')
  public question: string;
}
