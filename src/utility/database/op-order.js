'use strict';

const pool = require('./db-connection');
const mysql = require('mysql');

const saveOrder = (connection, order) => {
  let {email, street1, street2, city, zip, state, firstname, lastname, creditcard, exp_date} = order;
  const STATEMENT = `INSERT INTO orders(email, street1, street2, city, zip, state, firstname, lastname, creditcard, exp_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
  let mysqlStatement = mysql.format(STATEMENT, [
    email,
    street1,
    street2,
    city,
    zip,
    state,
    firstname,
    lastname,
    creditcard,
    exp_date
  ]);
  console.log(`Executing: ${mysqlStatement}`);
  return new Promise((resolve, reject) => {
    connection.query(mysqlStatement, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

const saveOrderItem = (connection, orderId, orderItem) => {
  let {item_id, count, price} = orderItem;
  const STATEMENT = `INSERT INTO order_items(order_id, item_id, count, price) VALUES(?, ?, ?, ?);`
  let mysqlStatement = mysql.format(STATEMENT, [
    orderId,
    item_id,
    count,
    price
  ]);
  console.log(`Executing: ${mysqlStatement}`);
  return new Promise((resolve, reject) => {
    connection.query(mysqlStatement, (err, result) => {
      if(err) {
        reject(new Error(`Error saving itemid: ${item_id}.  Reason: ${err.message}`));
      } else {
        resolve(`Saved itemId(${item_id}), order_item_id(${result.insertId})`);
      }
    })
  })
};

class OrderDao {
  saveOrder(orderInfo) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.beginTransaction(err=> {
            saveOrder(connection, orderInfo.order).then(orderId => {
              let promises = [];
              for (let orderItem of orderInfo.orderItems) {
                promises.push(saveOrderItem(connection, orderId, orderItem));
              }
              if (promises.length > 0) {
                Promise.all(promises).then(() => {
                  connection.commit(errCommit => {
                    if (errCommit) {
                      reject(errCommit);
                    } else {
                      resolve(orderId);
                    }
                  })
                }).catch(err => {
                  reject(err);
                })
              }
            }).catch(err => {
              connection.rollback(errRollback => {
                if (errRollback) {
                  reject(errRollback)
                } else {
                  reject(err);
                }
              });
            })
          })
        }
      });
    });
  }
}

module.exports = OrderDao;