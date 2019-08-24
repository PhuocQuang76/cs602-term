const Category = require('./op-category');
const User = require('./op-user');
const Item = require('./op-items');
const Order = require('./op-order');

module.exports = {
  //we really only need one Category Data Access Object instance here.
  CategoryDao: new Category(),
  UserDao: new User(),
  ItemDao: new Item(),
  OrderDao: new Order()
};