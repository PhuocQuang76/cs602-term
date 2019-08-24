'use strict';

const itemDao = require('../../../utility/database').ItemDao;

const groupItemsInThree = items => {
  let count = 0;
  let itemRows = [];
  let itemRowCollection = [];
  for (let item of items) {
    count++;
    itemRowCollection.push(item);
    if (count % 3  === 0) {
      itemRows.push({itemRowCollection: itemRowCollection});
      itemRowCollection = [];
    }
  }
  if (itemRowCollection.length > 0) {
    itemRows.push({itemRowCollection: itemRowCollection});
  }
  return itemRows;
};

module.exports = () => {
  return new Promise((resolve, reject) => {
    itemDao.getFeaturedItems().then(results => {
      resolve(groupItemsInThree(results));
    }).catch(err=> {
      reject(err)
    });
  })
};