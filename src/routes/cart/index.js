'use strict';

const express = require('express');
const config = require('../../config');
const cartHandler = require('../../handlers/cart');
const router = express.Router();

router.post('/item', (req, res, next) => {
  let sess = req.session;
  try {
    if (!sess.cart) sess.cart = {};
    if (sess.cart[req.body.itemId]) {
      sess.cart[req.body.itemId]++;
    } else {
      sess.cart[req.body.itemId] = 1;
    }
    let count = 0;
    for (let i in sess.cart) {
      count += sess.cart[i];
    }
    res.send({items: count});
  } catch (err) {
    next(err)
  };
});

router.get('/checkout.html', (req, res, next) => {
  let sess = req.session;
  let isAdmin = sess.user ? sess.user.type === 'admin':false;
  cartHandler.getCartItemsInfo(req).then(results => {
    console.log(results);
    res.render('cart/checkout', {
      title: config.app.title,
      groupedCategory: req.locals.groupedCategory,
      categories: req.locals.categories,
      items: results.items,
      total: results.total,
      isAdmin: isAdmin,
      isError: false,
      user: sess.user,
      anonymous: sess.user === undefined,
      cartItemCount: req.locals.cartItems
    })
  }).catch(err => {
    res.render('cart/checkout', {
      title: config.app.title,
      groupedCategory: req.locals.groupedCategory,
      categories: req.locals.categories,
      isError: true,
      errorMessage: err.message,
      isAdmin: isAdmin,
      user: sess.user,
      anonymous: sess.user === undefined,
      cartItemCount: req.locals.cartItems
    })
  });
});

router.post('/checkout.html', (req, res, next) => {
  console.log(JSON.stringify(req.body));
  let sess = req.session;
  let isAdmin = sess.user ? sess.user.type === 'admin':false;
  cartHandler.updateCartItems(req);
  cartHandler.getCartItemsInfo(req).then(results => {
    console.log(results);
    res.render('cart/checkout', {
      title: config.app.title,
      groupedCategory: req.locals.groupedCategory,
      categories: req.locals.categories,
      items: results.items,
      total: results.total,
      isAdmin: isAdmin,
      user: sess.user,
      anonymous: sess.user === undefined,
      cartItemCount: req.locals.cartItems
    })
  }).catch(err => {
    res.render('cart/checkout', {
      title: config.app.title,
      groupedCategory: req.locals.groupedCategory,
      categories: req.locals.categories,
      isError: true,
      errorMessage: err.message,
      isAdmin: isAdmin,
      user: sess.user,
      anonymous: sess.user === undefined,
      cartItemCount: req.locals.cartItems
    })
  });
});

router.get('/empty.html', (req, res, next) => {
  delete req.session.cart;
  res.redirect('/');
});

router.get('/pay.html', (req, res, next) => {
  let sess = req.session;
  let isAdmin = sess.user ? sess.user.type === 'admin':false;
  let user = sess.user;
  let firstname, lastname, email;
  if (user) {
    firstname = user.firstname;
    lastname = user.lastname;
    email = user.email;
  }
  res.render('cart/pay', {
    title: config.app.title,
    groupedCategory: req.locals.groupedCategory,
    categories: req.locals.categories,
    isAdmin: isAdmin,
    isError: false,
    user: sess.user,
    anonymous: sess.user === undefined,
    cartItemCount: req.locals.cartItems,
    firstname: firstname,
    lastname: lastname,
    email: email
  })
});

function pad(num, size) {
  let s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

router.post('/pay.html', (req, res) => {
  cartHandler.submitOrder(req).then(result => {
    delete req.session.cart;
    res.render('cart/confirm', {
      orderId: pad(result.orderId, 10)
    });
  }).catch(o => {
    let params = Object.assign({isError: true, errorMessage: o.err.message}, o);
    res.render('cart/pay', params);
  })
});


module.exports = router;