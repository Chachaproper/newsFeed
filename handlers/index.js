'use strict';

const Router = require('koa-router');
const _      = require('lodash');
const fs     = require('co-fs');

/**
 * Хранилище выполняющее роль базы данных
 */
let store = {
  likes: {}
};

const getRndInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getNews = function*() {
  let data;

  try {
    data = JSON.parse(yield fs.readFile('./data/data.json'))
  } catch (err) {
    this.status = 500;
    this.body   = {err};
    return;
  }

  let result = [];

  _.forIn(data.values, (item, key) => {

    /**
     * Заполняю рандомом лайки если пусто.
     * Для наглядности.
     * Если сервер перезапустился, то лайков не будет,
     * нужно повторно вызвать getNews
     */

    if (!store.likes[key]) {
      store.likes[key] = getRndInt(0, 10);
    }

    item.id    = key;
    item.likes = store.likes[key];

    result.push(item);
  });

  this.body = {
    data: result
  }
};

const like = function*() {
  let newsLikes = store.likes[this.params.id] + 1;

  store.likes[this.params.id] = newsLikes;

  this.body = {
    id:    this.params.news,
    likes: newsLikes
  }
};

const unlike = function*() {
  let newsLikes = store.likes[this.params.id] - 1;

  newsLikes = newsLikes < 0 ? 0 : newsLikes;

  store.likes[this.params.id] = newsLikes;

  this.body = {
    id:    this.params.news,
    likes: newsLikes
  }
};

const router = {
  public: Router(),
  api:    Router({
    prefix: '/v1'
  })
};

router.public
  .get('/', function*() {
    yield this.render('index')
  });

router.api
  .get('/news', getNews)
  .post('/like/:id', like)
  .delete('/like/:id', unlike);

module.exports = router;
