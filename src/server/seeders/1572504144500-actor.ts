/* eslint-disable no-await-in-loop */
import { MigrationInterface, getManager } from 'typeorm';
import argon2 from 'argon2';
import { Chance } from 'chance';
import { Actor } from '@server/entities/actor';
import { ActorAccount } from '@server/entities/actor-account';
import { Cart } from '@server/entities/cart';
import { CART_STATUS } from '@typings/entities/cart';
import { Role, ROLE_NAME } from '@server/entities/role';

const chance = new Chance();
const numberOfActors = 5;

export class Actor1572504144500 implements MigrationInterface {
  public up = async (): Promise<any> => {
    const db = getManager('seed');
    const role = await db.findOne(Role, { name: ROLE_NAME.ACTOR });

    const password = await argon2.hash('Welcome123', {
      timeCost: 2000,
      memoryCost: 500,
    });

    for (let i = 0; i < numberOfActors; i++) {
      const email = chance.email();

      await db.transaction(async (transactionalEntityManager) => {
        const actor = await db.create(Actor as any, {
          role_id: role && role.id,
          first_name: chance.first(),
          last_name: chance.last(),
          email,
          password,
        });

        await transactionalEntityManager.save(actor);

        await transactionalEntityManager.insert(ActorAccount, {
          actor_id: (actor as any).id,
        });

        await transactionalEntityManager.insert(Cart, {
          actor_id: (actor as any).id,
          status: CART_STATUS.NEW,
        });
      });
    }
  };

  public down = async (): Promise<any> => {};
}
