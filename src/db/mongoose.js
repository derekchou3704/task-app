const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
});

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: 7,
        required: true,
        trim: true,
        validate(val) {
            if (val.toLowerCase().match('password')) throw new Error('Password must not contained the word "pasword"')
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(val)  {
            if (val < 0) throw new Error('Age must be positive')
        }
    }
})

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const course = new Task({
    description: 'Socket.io WebDevYT',
})

course.save().then(() => {
    console.log(course)
}).catch((e) => {
    console.log('Error: ', e)
})

// const me = new User({
//     name: 'Derek',
//     age: 24,
//     email: 'DerekChou@gmail.com',
//     password: 'pppwwwooo123'
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((err) => {
//     console.log('Error: ', err)
// })