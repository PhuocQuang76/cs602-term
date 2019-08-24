'use strict';

/*
This file will create a connection.  Include this file in all database operations in this folder.
 */
const config = require('../../config');

const mysql = require('mysql');

/*
Normall, you'd need a structure similar to this:
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
});

However, the config already contains the connection information, so
you can simplify it to the one we have below.
 */


const pool = mysql.createPool(config.mysql); //create a pool, so you don't have to manage your connections manually.

module.exports = pool; //export this pool for other modules to use.