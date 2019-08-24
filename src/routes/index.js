const express = require('express');
const router = express.Router();
const config = require('../config');
const itemHandler = require('../handlers/admin/items');

/* GET home page. */
router.get('/', (req, res, next) => {
  let sess = req.session;
  let isAdmin = sess.user ? sess.user.type === 'admin':false;
  itemHandler.getFeaturedItems().then(results => {
    res.render('index', {
      title: config.app.title,
      groupedCategory: req.locals.groupedCategory,
      categories: req.locals.categories,
      itemRow: results,
      isAdmin: isAdmin,
      user: sess.user,
      anonymous: sess.user === undefined,
      cartItemCount: req.locals.cartItems
    });
  }).catch(err=>next(err));

});

module.exports = router;
