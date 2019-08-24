'use strict';

const express = require('express');
const config = require('../../config');
const router = express.Router();

const itemHandler = require('../../handlers').admin.item;

router.get('/:categoryId', (req, res, next) => {
  let sess = req.session;
  let isAdmin = sess.user ? sess.user.type === 'admin':false;
  itemHandler.getItemsForCategory(req).then(results => {
    res.render('categories/category-items', {
      title: config.app.title,
      groupedCategory: req.locals.groupedCategory,
      categories: req.locals.categories,
      itemRow: results,
      isAdmin: isAdmin,
      user: sess.user,
      anonymous: sess.user === undefined,
      cartItemCount: req.locals.cartItems
    });
  }).catch(err=> {
    next(err)
  });

});

router.post('/:categoryId', (req, res, next) => {
  let sess = req.session;
  let isAdmin = sess.user ? sess.user.type === 'admin':false;
  itemHandler.add(req).then(result => {
    return itemHandler.getItemsForCategory(req)
  }).then(results => {
    res.render('categories/category-items', {
      title: config.app.title,
      groupedCategory: req.locals.groupedCategory,
      categories: req.locals.categories,
      itemRow: results,
      isAdmin: isAdmin,
      user: sess.user,
      anonymous: sess.user === undefined,
      cartItemCount: req.locals.cartItems
    });
  }).catch(err=> {
    next(err)
  });
});

module.exports = router;

