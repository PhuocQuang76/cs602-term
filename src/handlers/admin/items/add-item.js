'use strict';

const path = require('path');
const mv = require('mv');

const itemDao = require('../../../utility/database').ItemDao;
const config = require('../../../config');
const moveToPublic = req => {
  return new Promise((res, rej) => {
    let tempFilePath = req.files['itemImageFile'].tempFilePath;
    let filename = path.basename(tempFilePath);
    let imageUpload = config.app.imageUploadPath;
    let destFilePath = path.join(imageUpload, 'items', filename);
    mv(tempFilePath, destFilePath, {mkdirp: true}, err => {
      if (err) {
        rej(error);
      } else {
          res(path.join(config.app.localImageUrl, 'items', filename));
      }
    });
  });
};

module.exports = req => {
  let errorMessage;
  if (!req.body.itemName) {
    errorMessage = 'Item must have a name.';
  } else if (!req.params.categoryId) {
    errorMessage = 'Item is not created in a category.';
  } else if (!req.body.price || isNaN(req.body.price)) {
    errorMessage = 'Item needs to have a valid price.';
  } else if (!req.files) {
    errorMessage = 'Item needs to have an image associated with it.';
  } else if (!req.body.count) {
    errorMessage = 'Item needs to have a count to put in stock.';
  }
  return new Promise((resolve, reject) => {
    if (errorMessage) {
      reject(new Error(errorMessage))
    } else {
      moveToPublic(req).then(imageUrl => {
        let isFeatured = (req.body.isFeatured === 'featured'?1:0);
        return itemDao.createItemForCategory(parseInt(req.params.categoryId), req.body.itemName, parseInt(req.body.price), isFeatured, imageUrl, parseInt(req.body.count));
      }).then(result => {
        resolve(result);
      }).catch(err => {
        reject(err);
      })
    }
  })

};