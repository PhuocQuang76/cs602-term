'use strict';

const itemDao = require('../../utility/database').ItemDao;
const orderDao = require('../../utility/database').OrderDao;

module.exports = req => {
  return new Promise((resolve, reject) => {
    let cart = req.session.cart;
    if (cart) {
      let errorMessage;
      if (!req.body['checkout-fn']) {
        errorMessage = 'First name is required.';
      } else if (!req.body['checkout-ln']) {
        errorMessage = 'Last name is required.';
      } else if (!req.body['checkout-email']) {
        errorMessage = 'Email is required.';
      } else if (!req.body['checkout-address1']) {
        errorMessage = 'Street name and number is required.';
      } else if (!req.body['checkout-city']) {
        errorMessage = 'City is required.';
      } else if (!req.body['checkout-zip']) {
        errorMessage = 'Zip code is required.';
      } else if (!req.body['checkout-state']) {
        errorMessage = 'State is required.';
      } else if (!req.body['checkout-country']) {
        errorMessage = 'Country is required.';
      } else if (!req.body['checkout-cc']) {
        errorMessage = 'Your credit card number is required.';
      } else if (!req.body['checkout-cc-exp']) {
        errorMessage = 'The expiration date on your credit card is required.';
      }
      if (errorMessage) {
        let input = {
          firstname: req.body['checkout-fn'],
          lastname: req.body['checkout-ln'],
          email: req.body['checkout-email'],
          address1: req.body['checkout-address1'],
          city: req.body['checkout-city'],
          zip: req.body['checkout-zip'],
          state: req.body['checkout-state'],
          country: req.body['checkout-country'],
          err: new Error(errorMessage)
        };
        reject(input);
      } else {
        let order = {
          email: req.body['checkout-email'],
          street1: req.body['checkout-address1'],
          street2: req.body['checkout-address2'],
          city: req.body['checkout-city'],
          zip: req.body['checkout-zip'],
          state: req.body['checkout-state'],
          firstname: req.body['checkout-fn'],
          lastname: req.body['checkout-ln'],
          creditcard: req.body['checkout-cc'],
          exp_date: req.body['checkout-cc-exp']
        };
        if (!order.street2) order.street2 = 'NA';
        let itemIds = [];
        if (cart) {
          for (let id in cart) {
            itemIds.push(id);
          }
        }
        if (itemIds.length > 0) {
          let items = {};
          itemDao.getItemInfo(itemIds).then(results => {
            results.map(item =>items[item.itemId] = item);
            let orderItems = [];
            let total = 0;
            for (let id in cart) {
              let orderItem = {
                item_id: id,
                count: cart[id],
                price: items[id].price
              };
              total += orderItem.price * orderItem.count;
              orderItems.push(orderItem);
            }
            orderDao.saveOrder({order: order, orderItems: orderItems}).then(orderId => {
              let o = {
                orderId: orderId,
                email: order.email,
                street1: order.street1,
                street2: order.street2,
                city: order.city,
                zip: order.zip,
                state: order.state,
                firstname: order.firstname,
                lastname: order.lastname,
                total: total
              };
              resolve(o);
            }).catch(errSaveOrder => {
              order.err = errSaveOrder
              reject(order);
            })
          });
        } else {
          order.err = new Error('No items in your cart.')
          reject(order);
        }
      }
    } else {
      let input = {
        firstname: req.body['checkout-fn'],
        lastname: req.body['checkout-ln'],
        email: req.body['checkout-email'],
        address1: req.body['checkout-address1'],
        address2: req.body['checkout-address2'],
        city: req.body['checkout-city'],
        state: req.body['checkout-state'],
        zip: req.body['checkout-zip'],
        country: req.body['checkout-country'],
        err: new Error(errorMessage)
      };
      input.err = new Error('No items in your cart.')
      reject(input);
    }
  })
};