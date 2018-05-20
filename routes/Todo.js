var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Task = require('../models/task');

/* GET home page. */
router.get('/', function(req, res, next) {
        Task.usertask(req.session.loggedUser.username, function (err, tasks) {
            if(err) {
                console.log("Strange error");
            } else {
                res.render('index.html', {tasks: tasks});
            }
        });
});

router.get('/newTask', function(req, res, next) {
    res.render('addNewTask.html');
});

router.post('/newTask', function(req, res, next) {
    var title, descr, dd, author, solver;
    title = req.body.title;
    descr = req.body.desc;
    dd = req.body.dd;
    author = req.session.loggedUser.username;
    solver = req.session.loggedUser.username;

    if(req.body.itemName) {
        User.getUserById(req.body.itemName, function (err, data) {
            if(err) {

            } else {
                solver = data.username;
                Task.newTask(title,descr,dd,author,solver, function (err) {
                    if(err) {
                        res.render('addNewTask.html',{type: "warning", error: 'Úkol nemohl být vytvořen, zkontrolujte zadané údaje.'})
                    } else {
                        return res.redirect("/todo/");
                    }
                });
            }
        });
    } else {
        Task.newTask(title,descr,dd,author,solver, function (err) {
            if(err) {
                res.render('addNewTask.html',{type: "warning", error: 'Úkol nemohl být vytvořen, zkontrolujte zadané údaje.'})
            } else {
                return res.redirect("/todo/");
            }
        });
    }
});


router.post('/edit', function(req, res, next) {
    var taskid = req.query.taskid;
    var title, descr, dd, author, solver;
    title = req.body.title;
    descr = req.body.desc;
    dd = req.body.dd;
    solver = req.session.loggedUser.username;

    if(req.body.itemName) {
        User.getUserById(req.body.itemName, function (err, data) {
            if(err) {

            } else {
                solver = data.username;
                Task.updateTask(taskid,title,descr,dd,solver, function (err) {
                    if(err) {
                        console.log("Strange error");
                        return res.redirect("/todo/");
                    } else {
                        return res.redirect("/todo/");
                    }
                });
            }
        });
    } else {
        Task.updateTask(taskid,title,descr,dd,solver, function (err) {
            if(err) {
                console.log("Strange error");
                return res.redirect("/todo/");
            } else {
                return res.redirect("/todo/");
            }
        });
    }
});


router.get('/edit', function(req, res, next) {
    var taskid = req.query.taskid;
    if(taskid) {
        Task.getTaskForEdit(taskid, req.session.loggedUser.username, function (err, data) {
            if(err) {
                return res.redirect("/todo/");
            } else if(!data) {
                return res.redirect("/todo/");
            } else {
                var date = "";
                if(data[0].deathline) {
                    var year = data[0].deathline.getFullYear();
                    var mo = data[0].deathline.getMonth()+1;
                    var day = data[0].deathline.getDate();
                    if(mo < 10) {
                        mo = "0"+mo;
                    }
                    if(day < 10) {
                        day = "0"+day;
                    }
                    date += year+"-"+mo+"-"+day;
                    console.log(date);
                }
                res.render('editTask.html', {task : data[0], date: date});
            }
        });
    } else {
        return res.redirect("/todo/");
    }

});

module.exports = router;
