'use strict';

let userDao = require('../../utility/database').UserDao;

module.exports = req => {
  return new Promise((resolve, reject) => {

    let errorMmessage;
    if (!req.body.username) {
      errorMmessage = 'Username is required.';
    } else if (!req.body.password) {
      errorMmessage = 'Password is required.';
    } else if (!req.body.firstname) {
      errorMmessage = 'First name is required.';
    } else if (!req.body.lastname) {
      errorMmessage = 'Last name is required.';
    } else if (!req.body.email) {
      errorMmessage = 'Email is required.';
    } else if (!req.body.confirmpassword) {
      errorMmessage = 'Please confirm the password.';
    } else if (!(req.body.password === req.body.confirmpassword)) {
      errorMmessage = 'Password does not match confirm password value.';
    }
    if (errorMmessage) {
      reject(new Error(errorMmessage))
    } else {
      let user = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        type: 'customer'
      };
      return userDao.createUser(user).then(user => {
        resolve(user);
      }).catch(error => {
        reject(error);
      });
    }
  });
};