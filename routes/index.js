var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Task = require('../models/task');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userId) {
    Task.usertask(req.session.userId, function (err, tasks) {
        if(err) {
          console.log("Strange error");
        } else {
            res.render('index.html', {title: 'Nevim', tasks: tasks});
        }
      });

  } else {
      return res.redirect('/login');
  }
});

router.get('/login', function(req, res, next) {
    res.render('login.html', { title: 'Nevim' });
});

router.get('/newuser', function(req, res, next) {
    res.render('newuser.html', { title: 'Nevim' });
});

router.post('/newuser', function(req, res, next) {
    if (req.body.login && req.body.password && req.body.password_rep) {
        if(req.body.password !== req.body.password_rep) {
            res.render('newuser.html', {type: "warning", error: 'Hesla se neshodují.' });
            return;
        }
        User.userLoginExist(req.body.username, function (error) {
            if(error) {
                res.render('newuser.html', { type: "warning", error: 'Login je již zabrán.' });
            } else {
                User.createNewAccount(req.body.login,req.body.password, function (error) {
                    if(error) {
                        res.render('newuser.html', {type: "warning", error: 'Nepodařilo se vytvořit uživatele.' });
                    } else {
                        res.render('index.html', { type: "success", error: 'Uživatel založen.' });
                    }
                });
            }
        });
    } else {
        res.render('newuser.html', {type: "warning", error: 'Musít být vyplněna všechna pole.' });
    }
});

router.post('/login', function(req, res, next) {
    if (req.body.login && req.body.password) {
        User.authenticate(req.body.login, req.body.password, function (error, user) {
            if (error || !user) {
                res.render('login.html', {type: "warning", error: 'Uživatel buď neexistuje, nebo zadáváte špatné heslo' });
            } else {
                req.session.userId = user._id;
                req.session.loggedUser = user;
                return res.redirect('/todo/');
            }});
    } else {
        return res.redirect('/login');
    }
});

router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/login');
            }
        });
    }
});

module.exports = router;
