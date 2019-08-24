'use strict';

const category = require('../../utility/database').CategoryDao;

/*
Because categories and the grouped one are present on almost every page,
we might as well make sure that it's part of the request as locals attribute.
 */
const initializeCategories = (req, res, next) => {
  category.getCategories().then(categories => {
    req.locals = {
      //we're setting the categories here of the request.locals
      categories: categories
    };
    return category.getGroupOf4Categories()
  }).then(groupOfFourCategories => {
    req.locals.groupedCategory = groupOfFourCategories;
    next();
  });
};

module.exports = initializeCategories;