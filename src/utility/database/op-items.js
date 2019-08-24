'use strict';

const pool = require('./db-connection');
const mysql = require('mysql');

const getIemInfo = itemId => {
  return new Promise((resolve, reject) => {
    const STATEMENT = `SELECT itemId, itemName, price, imageUrl FROM items WHERE items.itemId = ?`;
    let mysqlStatement = mysql.format(STATEMENT, [itemId]);
    console.log(`Executing: ${mysqlStatement}`);
    pool.query(mysqlStatement, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  })
};

class ItemDao {
  createItemForCategory(categoryId, name, price, isFeatured, imageUrl, count) {
    const STATEMENT = `INSERT INTO items(categoryid, itemName, price, feature, imageUrl, count) VAlUES (?, ?, ?, ?, ?, ?)`;
    let mysqlStatement = mysql.format(STATEMENT, [
      categoryId,
      name,
      price,
      isFeatured,
      imageUrl,
      count
    ]);
    console.log(`Executing: ${mysqlStatement}`);
    return new Promise((resolve, reject) => {
      pool.query(mysqlStatement, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let data = {id: result.insertId, name, categoryId, price, isFeatured, imageUrl, count};
          resolve(data);
        }
      })
    });
  }

  getFeaturedItems() {
    const STATEMENT = 'SELECT itemId, itemName, price, imageUrl, count FROM items WHERE items.feature = 1 ORDER BY itemName';
    return new Promise((resolve, reject) => {
      pool.query(STATEMENT, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    });
  }

  getCategoryItems(categoryId) {
    const STATEMENT = 'SELECT itemId, itemName, price, imageUrl, count FROM items WHERE items.categoryId = ?';
    let mysqlStatement = mysql.format(STATEMENT, [categoryId]);
    return new Promise((resolve, reject) => {
      pool.query(mysqlStatement, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      })
    })
  }

  getItemInfo(itemIds) {
    return new Promise((resolve, reject) => {
      let promises = [];
      itemIds.map(itemId => promises.push(getIemInfo(itemId)));
      if (promises.length > 0) {
        Promise.all(promises).then(results => {
          let r = [];
          results.map(r1 => {
            r.push(r1[0])
          });
          resolve(r);
        }).catch (err => reject(err));
      }
    });

  }
}

module.exports = ItemDao;