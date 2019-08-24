'use strict';


const express = require('express');
const router = express.Router();
const categoryHandler = require('../../handlers/admin').category;
const config = require('../../config');

router.get('/category', (req, res) => {
  let sess = req.session;
  let isAdmin = sess.user ? sess.user.type === 'admin':false;
  if (sess.user && isAdmin) {
    res.render('categories/category-add', {
      title: config.app.title,
        groupedCategory: req.locals.groupedCategory,
        categories: req.locals.categories,
        isAdmin: isAdmin,
        user: sess.user,
        anonymous: sess.user === undefined,
        cartItemCount: req.locals.cartItems
    });
  } else {
    res.redirect('/user/login.html');
  }
});

router.post('/category', (req, res) => {
  let sess = req.session;
  let isAdmin = sess.user ? sess.user.type === 'admin':false;
  if (!sess.user || !isAdmin) {
    res.redirect('/user/login.html');
  } else {
    categoryHandler.add(req).then(() => {
      res.render('categories/category-add', {
        title: config.app.title,
        groupedCategory: req.locals.groupedCategory,
        categories: req.locals.categories,
        isAdmin: isAdmin,
        user: sess.user,
        anonymous: sess.user === undefined
      });
    }).catch(err => {
      res.render('categories/category-add', {
        title: config.app.title,
        errorMessage: err.message,
        isError: true,
        groupedCategory: req.locals.groupedCategory,
        categories: req.locals.categories,
        isAdmin: isAdmin,
        user: sess.user,
        anonymous: sess.user === undefined
      });
    });
  }
});

module.exports = router;