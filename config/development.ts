import merge from 'deepmerge';
import defaultConfig from './default';

export default merge(
  defaultConfig,
  {
    server: {
      host: 'http://localhost',
      logger: {
        level: 'debug',
        pretty: true,
      },
      auth: {
        enabled: true,
        confirmable: false,
        lockable: {
          enabled: true,
        },
      },
      mailer: {
        sendEmails: false,
      },
      contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'js.stripe.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        fontSrc: ["'self'", 'data:', 'fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'images.unsplash.com'],
        connectSrc: ["'self'", 'cdn.plyr.io'],
        frameSrc: ['js.stripe.com', 'static.videezy.com'],
        mediaSrc: [
          "'self'",
          'static.videezy.com',
          'cdn.plyr.io',
          'zerotosixtyjavascript.s3.us-east-2.amazonaws.com',
        ],
        workerSrc: ["'self'", 'blob:', 'static.videezy.com'],
      },
      dirs: {
        routes: ['src/views/**/routes.ts', 'src/server/api/**/*.ts'],
        specialRoutes: ['src/server/api/webhooks/**/*.ts'],
      },
    },
  },
  { arrayMerge: (destinationArray, sourceArray, options) => sourceArray }
);
