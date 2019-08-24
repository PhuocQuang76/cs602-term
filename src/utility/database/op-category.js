'use strict';

const pool = require('./db-connection');
const mysql = require('mysql');

let categories = undefined; //this variable contains the cached copy from the database to minimize db operations.
let groupedOf4Categories; //It is a good idea to cache the categories.  This data don't change too often.

/**
 * Sort categories according to name.
 * @param categories an array of category object, from the database
 * consisting of id, name and image_url as attributes.  This method is
 * effectively internal to the class.
 * @returns {*}
 */
const sortCagegoriesByName = categories => {
  return categories.sort((a, b) => (a.name > b.name) ? 1:-1);
};

/**
 * This method groups the categories into four items per row.
 * Do not use this method until you have called "getCategories()" method.
 * Yes!!!  It's bad programming practice, but normally, application initialization is
 * topic not discussed in this subject.
 * @param categories Array of categories.
 * @param itemsPerGroup
 * @returns {Array}
 */
const groupCategories = (categories, itemsPerGroup) =>{
  categories = sortCagegoriesByName(categories); //sort the categories.
  let categoryRow = [];
  let categoryRowCollection = [];
  let count = 0;
  for (let category of categories) {
    count++;
    categoryRowCollection.push(category);
    if (count % itemsPerGroup === 0) {
      categoryRow.push({categoryCollection: categoryRowCollection});
      categoryRowCollection = [];
    }
  }
  if (categoryRowCollection.length > 0) categoryRow.push({categoryCollection: categoryRowCollection});
  return categoryRow;
};

class Category {
  /**
   * This method retrieves the categories from the database if the cache has not been set.  If also
   * sorts the categories into group of 4 categories per row.  Yes, normally, you'd have handlebars do that,
   * but you'd have to write a ton of helpers just to achieve that process. Oh joy, the pitfalls of server side
   * MVC!!!
   * @returns {Promise<any>}
   */
  getCategories() {
    const STATEMENT = 'SELECT id, name, image_url FROM category'; //sql statement to execute in order to retrieve categories
    return new Promise((resolve, reject) => {
      if (categories === undefined) {//check if categories cache variable is undefined,.
        //if it is undefined, go fetch it from the databsse.
        pool.query(STATEMENT, (error, results) => {
          if (error) {
            console.log(error.message);
            reject(error); //essentially throw an error here.
          } else {
            let data = [];
            for (let r of results) {
              data.push({id: r.id, name: r.name, image_url: r.image_url});
            }
            categories = data;
            groupedOf4Categories = groupCategories(categories, 4);
            resolve(categories);
          }
        })
      } else {
        //if initialized just return what is in cache.
        resolve(categories);
      }
    })
  }

  /**
   * just return the grouped4Categories (after the application had retrieved it from the database).
   * @returns {Promise<any>}
   */
  getGroupOf4Categories() {
    return new Promise((resolve, reject) => {
      //Get the categories first.  Don't worry, if the categories have been intialized, you'll
      //just be getting a cached version of it.
      this.getCategories().then(() => {
        resolve(groupedOf4Categories);
      }).catch(err => {
        reject(err);
      })
    })
  }

  createCategory({name, image_url}) {
    return new Promise((resolve, reject) => {
      const STATEMENT = `INSERT INTO category (name, image_url) VALUES (?, ?);`;
      let mysqlStatement = mysql.format(STATEMENT, [name, image_url]);
      pool.query(mysqlStatement, err=> {
        if (err) reject(err);
        else {
          this.resetCategories();
          this.getCategories().then(() => {
            resolve({name, image_url})
          }).catch(err => {
            reject(err);
          })
        }
      });
    })
  }

  resetCategories() {
    categories = undefined;
    groupedOf4Categories = undefined;
  }
}

module.exports = Category;