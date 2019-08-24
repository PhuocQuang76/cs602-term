'use strict';

module.exports = req => {
  let cart = req.session.cart;
  let items = req.body.itemId;
  if (!Array.isArray(items)) items = [items];
  let counts = req.body.itemCount;
  if (!Array.isArray(counts)) counts = [counts];
  if (cart) {
    for (let counter = 0; counter < items.length; counter++) {
      try {
        if (counts[counter] === '' || counts[counter] == 0) {
          delete cart[items[counter]];
        } else if (isNaN(counts[counter])) {
          continue;
        } else {
          cart[items[counter]] = parseInt(counts[counter]);
        }
      } catch (err) {
        //ignore the error.
      }
    }
    let count = 0;
    if (cart){
      for (let i in cart) {
        count += cart[i];
      }
    }
    req.locals.cartItems = count;
  }
};