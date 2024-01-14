const express = require('express');
const router = express.Router();
const Article = require('../schemas/article');
const moment = require('moment');

router.get('/list', async (req, res) => {
  const searchOption = {
    boardTypeCode: '0',
    title: '',
    isDisplayCode: '9',
  };

  const articles = await Article.find({});

  res.render('article/list.ejs', { articles, searchOption, moment });
});

//http://localhost:/article/list
//POST
router.post('/list', async (req, res) => {
  const { boardTypeCode, title, isDisplayCode } = req.body;

  const searchOption = {
    boardTypeCode,
    title,
    isDisplayCode,
  };

  const articles = await Article.find({});

  res.render('article/list.ejs', { articles, searchOption });
});

//신규 게시글 등록
//http://localhost:3000/article/create
router.get('/create', async (req, res) => {
  res.render('article/create.ejs');
});

//신규 게시글 사용자 등록정보 처리 요청 및 응답 라우팅메소드
router.post('/create', async (req, res) => {
  const { title, contents, articleTypeCode, isDisplayCode, register } =
    req.body;

  const article = {
    title,
    contents,
    article_type_code: articleTypeCode,
    view_count: 0,
    is_display_code: isDisplayCode,
    edit_member_id: register,
    edit_date: Date.now(),
  };

  try {
    await Article.create(article);
  } catch (error) {
    console.log(error);
  }

  res.redirect('/article/list');
});

router.get('/delete', async (req, res) => {
  const articleIdx = req.query.aid;
  await Article.deleteOne({ article_id: articleIdx });
  res.redirect('/article/list');
});

router.get('/modify/:aid', async (req, res) => {
  const articleIndex = req.params.aid;
  const article = await Article.findOne({ article_id: articleIndex });
  res.render('article/modify.ejs', { article });
});

router.post('/modify/:aid', async (req, res) => {
  const articleIdx = req.params.aid;

  const { title, contents, articleTypeCode, isDisplayCode, register } =
    req.body;

  const article = {
    title,
    contents,
    article_type_code: articleTypeCode,
    view_count: 0,
    is_display_code: isDisplayCode,
    edit_member_id: register,
    edit_date: Date.now(),
  };

  await Article.updateOne({ article_id: articleIdx }, article);

  res.redirect('/article/list');
});

module.exports = router;
