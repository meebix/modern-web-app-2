import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialConstraints1594269292840 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      -- actor
      ALTER TABLE actor ADD CONSTRAINT actor_role_id_fkey FOREIGN KEY (role_id) REFERENCES role (uuid);

      -- actor_account
      ALTER TABLE actor_account ADD CONSTRAINT actor_account_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES actor (uuid);

      -- oauth
      ALTER TABLE oauth ADD CONSTRAINT oauth_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES actor (uuid);
      `
    );
  };

  public down = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      -- actor

      ALTER TABLE actor DROP CONSTRAINT actor_role_id_fkey;

      -- actor_account
      ALTER TABLE actor_account DROP CONSTRAINT actor_account_actor_id_fkey;

      -- oauth
      ALTER TABLE oauth DROP CONSTRAINT oauth_actor_id_fkey;
      `
    );
  };
}
