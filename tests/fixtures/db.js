const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const Task = require('../../models/task')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'Example123!',
    tokens:[{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRETE)
    }]
}

const userTwo = {
    _id: userTwoId,
    name: 'Amy',
    email: 'amy@example.com',
    password: 'Example123!',
    tokens:[{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRETE)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: true,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: false,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: false,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()  
    await new User(userTwo).save()  
    await new Task(taskOne).save()  
    await new Task(taskTwo).save()  
    await new Task(taskThree).save()  
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}