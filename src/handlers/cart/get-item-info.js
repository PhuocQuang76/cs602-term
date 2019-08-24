'use strict';

const itemDao = require('../../utility/database').ItemDao;

const sortItemsByName = (items) => {

};

module.exports = (req) => {
  let cart = req.session.cart;
  let itemIds = [];
  if (cart) {
    for (let id in cart) {
      itemIds.push(id);
    }
  }
  return new Promise((resolve, reject) => {
    if (itemIds.length > 0) {
      itemDao.getItemInfo(itemIds).then(results => {
        let items = results.sort((a, b) => (a.itemName > b.itemName) ? 1:-11);
        let returnItems = [];
        let total = 0;
        items.map(item => {
          if (item) {
              let count = cart[item.itemId];
              let itemTotal = (count * item.price);
              total += itemTotal
              returnItems.push({
                  itemId: item.itemId,
                  itemImage: item.imageUrl,
                  itemCount: count,
                  itemName: item.itemName,
                  itemPrice: item.price.toFixed(2),
                  itemTotal: itemTotal.toFixed(2)
              });
          }
        });
        resolve({items: returnItems, total: total.toFixed(2)});
      }).catch(err => reject(err));
    } else {
      reject(new Error('No items in cart.'));
    }
  });

}