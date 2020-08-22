import { Entity, Column } from 'typeorm';
import { Base } from './partials/base';

@Entity('customer')
export class Customer extends Base {
  @Column('uuid')
  public actor_id: string;

  @Column('character varying', { nullable: true })
  public vendor_id: string | null;

  @Column('character varying', { nullable: true })
  public phone_country_code: string | null;

  @Column('character varying', { nullable: true })
  public phone: string | null;

  @Column('character varying', { nullable: true })
  public country: string | null;

  @Column('character varying', { nullable: true })
  public address1: string | null;

  @Column('character varying', { nullable: true })
  public address2: string | null;

  @Column('character varying', { nullable: true })
  public city: string | null;

  @Column('character varying', { nullable: true })
  public state: string | null;

  @Column('character varying', { nullable: true })
  public postal_code: string | null;
}
