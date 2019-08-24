'use strict';

/*
Crypto is a native library in nodejs that allows us to perform cryptology operations
like creating hashes.  Hashes are the preferred way to store passwords in the database.
We really don't need to know a user's password, only that when we generate a random string for
it, we can reproduce it every time the same input/password is used.
 */
const crypto = require('crypto');

//Normally, this should be in a config vault system, but let's hard code it here.
//Salts are use so that hackers cannot do a dictionary or brute force attacks when
//guessing passwords.
const MY_APP_SALT = 'NodeJS Programming is fun!!!';

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function(password, salt){
  let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  let value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  };
};

const saltHashPassword = userpassword => {
  return sha512(userpassword, MY_APP_SALT);

};

module.exports = saltHashPassword;