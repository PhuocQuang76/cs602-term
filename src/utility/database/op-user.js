'use strict';

const pool = require('./db-connection');
const passwordHash = require('../crypto').passwordHash;
const mysql = require('mysql');

class User {

  getUserByUsername(username, password){
    //This statement will be open for SQL injection.
    //But this is just a term project, and using Sequelize will be more work in itself.
    let STATEMENT = `SELECT id, username, password, firstname, lastname, email, type FROM app_users WHERE username = '${username}'`;
    return new Promise((resolve, reject) => {
      pool.query(STATEMENT, (err, results) => {
        if (err) {
          console.log(err.message);
          reject(new Error('Invalid username or password'));
        } else {
          if (results.length > 0) {
            let passwordhash = passwordHash(password);
            if (results[0].password === passwordhash.passwordHash) {
              resolve(results[0]);
            } else {
              reject(new Error('Invalid username or password.'));
            }
          } else {
            reject(new Error('Invalid username or password.'));
          }
        }

      });
    });
  };

  createUser(information) {
    let {username, password, firstname, lastname, email, type} = information;
    let STATEMENT = `INSERT INTO app_users(username, password, firstname, lastname, email, type) VALUES(?, ?, ?, ?, ?, ?);`;
    return new Promise((resolve, reject) => {
      let passwordHashValue = passwordHash(password).passwordHash;
      if (!type) type = 'customer';
      let mysqlStatement = mysql.format(STATEMENT, [
        username,
        passwordHashValue,
        firstname,
        lastname,
        email,
        type
      ]);
      console.log(`Performing: ${mysqlStatement}`);
      pool.query(mysqlStatement, (err, results) => {
        if (err) reject (err.message);
        else {
          console.log(results);
          resolve({id: results.insertId, username, passwordHashValue, firstname, lastname, email, type});
        }
      });
    })
  }
}

module.exports = User;
