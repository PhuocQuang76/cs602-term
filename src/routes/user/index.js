'use strict';


const express = require('express');
const router = express.Router();
const userDao = require('../../utility/database').UserDao;
const userHandler = require('../../handlers').user;
router.get('/login.html', (req, res, next) => {
  res.render('users/account-login', {
    title: 'Login / Register Account'
  });
});

router.post('/login.html', (req, res, next) => {
  userDao.getUserByUsername(req.body.username, req.body.password).then(user => {
    req.session.user = user;
    res.redirect('/');
  }).catch(err => {
    res.render('users/account-login', {
      title: 'Login / Register Account',
      errormessage: err.message,
      errorLoginCreate: true
    })
  });
});

router.post('/create-user.html', (req, res, next) => {
  userHandler.add(req).then(user => {
    req.session.user = user;
    res.redirect('/');
  }).catch(err => {
    res.render('users/account-login', {
      title: 'Login / Register Account',
      errormessage: err.message,
      errorLoginCreate: true
    });
  })
});

router.get('/logout.html', (req, res, next) => {
  delete req.session.user;
  res.redirect('/');
});

module.exports = router;