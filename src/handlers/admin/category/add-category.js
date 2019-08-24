'use strict';

const config = require('../../../config');
const path = require('path');
const mv = require('mv');

const categoryDao = require('../../../utility/database').CategoryDao;

const saveInfoToDb = info => {
  return categoryDao.createCategory(info);
};

module.exports = (req) => {
  return new Promise((resolve, reject) => {
    let errorMessage;
    if (!req.body.categoryDescription) {
      errorMessage = 'Category need a description.';
    } else if (req.body.categoryImageUrl.length === 0 && !req.files) {
      errorMessage = 'Please provide either an image url or an image file.'
    }
    if (errorMessage) {
      reject(new Error(errorMessage));
    } else {
      let p;
      if (req.files) {
        p = new Promise((res, rej) => {
          let tempFilePath = req.files['categoryImageFile'].tempFilePath;
          let filename = path.basename(tempFilePath);
          let imageUpload = config.app.imageUploadPath;
          let destFilePath = path.join(imageUpload, 'categories', filename);
          mv(tempFilePath, destFilePath, {mkdirp: true}, err => {
            if (err) {
              reject(error);
            } else {
              let info = {
                name: req.body.categoryDescription,
                image_url: path.join(config.app.localImageUrl, 'categories', filename)
              };
              saveInfoToDb(info).then(() => resolve()).catch(err => reject(err));
            }
          });
        });
      } else {
        p = saveInfoToDb({name: req.body.categoryDescription, image_url: req.body.categoryImageUrl});
      }
      p.then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      })
    }
  })
};