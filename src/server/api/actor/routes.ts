import { secureApi } from '@server/middleware/app-middleware';
import * as controller from './controller';

export default {
  path: '/api/v1/actor',
  routes: [
    {
      path: '/me',
      method: 'get',
      middleware: [secureApi],
      controller: controller.getMe,
    },
    {
      path: '/unlock-account',
      method: 'post',
      controller: controller.unlockActorAccount,
    },
  ],
};
