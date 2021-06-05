const mongoose = require('mongoose')
const validator = require('validator')

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
        validate(val) {
            if (!validator.isEmail(val)) throw new Error('Invalid Email!')
        }
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

module.exports = User