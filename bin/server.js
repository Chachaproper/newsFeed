'use strict';

const koa       = require('koa')();
const views     = require('koa-views');
const logger    = require('koa-logger');
const serve = require('koa-static');
const router    = require('../handlers');


koa
  .use(logger())
  .use(views('./templates', {
    extension: 'pug'
  }))
  .use(serve(process.cwd()))
  .use(router.api.routes())
  .use(router.public.routes())
  .use(router.api.allowedMethods())
  .use(router.public.allowedMethods());

const server = koa.listen(3000);
console.log('Server listening on port: ' + server.address().port);
