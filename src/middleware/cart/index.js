'use strict';

module.exports = (req, res, next) => {
  let sess = req.session;
  let count = 0;
  if (sess.cart){
    for (let i in sess.cart) {
      count += sess.cart[i];
    }
  }
  req.locals.cartItems = count;
  next();
};
