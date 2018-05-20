const mongoose = require('mongoose');
const moment = require('moment');

const format = "YYYY/DD/MM";
// basic schema, only username and password
let TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    },
    deathline: {
        type: Date
    },
    description: {
        type: String,
    },
    author: {
        type: String,
        required: true
    },
    solver: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }
});

// authenticate input against database
TaskSchema.statics.usertask = function (id, callback) {
    Task.find({ solver: id, state: 'ACTIVE' })
        .exec(function (err, tasks) {
            if (err) {
                return callback(err)
            } else {
                for(var i = 0; i < tasks.length; i++) {
                    tasks[i].deathline = moment(tasks[i].deathline).format(format);
                }
                return callback(null, tasks);
            }
        });
}

TaskSchema.statics.newTask = function (title, descr, dd, author, solver, callback) {
    var task = new Task({title:title, description:descr, solver: solver, author:author, state:'ACTIVE', deathline:dd});
    task.save(function (err) {
        if (err) {
            return callback(err)
        } else {
            return callback();
        }
    });
}

TaskSchema.statics.getTasks = function (id, states, callback) {
    Task.find({ solver: id, state:{$in: states}})
        .exec(function (err, tasks) {
            if (err) {
                return callback(err)
            } else {
                for(var i = 0; i < tasks.length; i++) {
                    tasks[i].deathline = moment(tasks[i].deathline).format(format);
                }
                return callback(null, tasks);
            }
        });
}

TaskSchema.statics.getTask = function (id, callback) {
    Task.find({ _id: id})
        .exec(function (err, task) {
            if (err) {
                return callback(err)
            } else {
                for(var i = 0; i < task.length; i++) {
                    task[i].deathline = moment(task[i].deathline).format(format);
                }
                return callback(null, task);
            }
        });
}

TaskSchema.statics.getTaskForEdit = function (id, author, callback) {
    Task.find({ _id: id, author: author})
        .exec(function (err, task) {
            if (err) {
                return callback(err)
            } else {
                for(var i = 0; i < task.length; i++) {
                    console.log(task[i].deathline);
                    task[i].deathline = moment(task[i].deathline).format(format);
                    console.log(task[i].deathline);
                }
                return callback(null, task);
            }
        });
}

TaskSchema.statics.deleteTask = function (id, username, callback) {
    var query = ({_id: id, author: username});
    var newValue = ({state: "DELETED"});
    Task.updateOne(query,newValue,function (err, res) {
        if (err) {
            return callback(err)
        } else {
            return callback(null, res);
        }
    })
}

TaskSchema.statics.completeTask = function (id, username, callback) {
    var query = ({_id: id, solver: username});
    var newValue = ({state: "COMPLETED"});
    Task.updateOne(query,newValue,function (err, res) {
        if (err) {
            return callback(err)
        } else {
            return callback(null, res);
        }
    })
}

TaskSchema.statics.updateTask = function (taskid, title, descr, dd, solver, callback) {
    var task = new Task();
    var query = ({_id: taskid});
    var newValue = ({title:title, description:descr, solver: solver, deathline:dd});
    Task.updateOne(query,newValue,function (err, res) {
        if (err) {
            return callback(err)
        } else {
            return callback(null, res);
        }
    })
}

let Task = mongoose.model('Task', TaskSchema);
module.exports = Task;