const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
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

// Defining a method on the model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new Error('Unable to login')

    return user
}

// Hash the plain password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User