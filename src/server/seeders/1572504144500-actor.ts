/* eslint-disable no-await-in-loop */
import { MigrationInterface, getManager } from 'typeorm';
import argon2 from 'argon2';
import { Chance } from 'chance';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { Actor } from '@server/entities/actor';
import { ActorAccount } from '@server/entities/actor-account';
import { Role, RoleName } from '@server/entities/role';
import generateCode from '@server/modules/code';
import { config } from '@config';

const chance = new Chance();
const numberOfActors = 5;

export class Actor1572504144500 implements MigrationInterface {
  public up = async (): Promise<any> => {
    const db = getManager('seed');
    const role = await db.findOne(Role, { name: RoleName.ACTOR });

    const password = await argon2.hash('Welcome123', {
      timeCost: 2000,
      memoryCost: 500,
    });

    for (let i = 0; i < numberOfActors; i++) {
      const email = chance.email();
      const refreshToken = jwt.sign(
        { hash: uuid() },
        config.server.auth.jwt.secret,
        {
          expiresIn: config.server.auth.jwt.refreshExpiresIn,
        }
      );

      await db.transaction(async (transactionalEntityManager) => {
        const actor = await db.create(Actor as any, {
          role_id: role && role.uuid,
          first_name: chance.first(),
          last_name: chance.last(),
          email,
          password,
          phone_country_code: 1,
          phone: chance.phone({ formatted: false, country: 'us' }),
          country: 'United States',
          address1: chance.address(),
          city: chance.city(),
          state: chance.state(),
          postal_code: chance.zip(),
        });

        await transactionalEntityManager.save(actor);

        await transactionalEntityManager.insert(ActorAccount, {
          actor_id: (actor as any).uuid,
          confirmed_code: config.server.auth.confirmable
            ? generateCode()
            : null,
          refresh_token: refreshToken,
        });
      });
    }
  };

  public down = async (): Promise<any> => {};
}
