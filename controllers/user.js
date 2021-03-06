const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')


module.exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body)
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
}

module.exports.login = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.status(200).send({ user: user.toJSON(), token })
    } catch (e) {
        res.status(400).send()
    }
}

module.exports.logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}

module.exports.logoutAll = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
}

module.exports.readProfile =  async (req, res) => {
    res.send(req.user)
}

module.exports.updateProfile = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password', 'age']

    const isValidOperation = updates.every(update =>  allowedUpdate.includes(update))
    if (!isValidOperation) return res.status(400).send({ error: 'Invalid Upadates' })

    try {        
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send()
    }   
}

module.exports.deleteUser = async (req, res) => {
    try {
        sendCancelationEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
}

const upload = multer({ 
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('Please upload a PNG, JPG or JPEG'))
        }
        cb(undefined, true)
    }
})

module.exports.uploadAvatar = async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send() 
}

module.exports.deleteAvatar = async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send() 
}

module.exports.checkAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) throw new Error()

        res.set('Content-Type', 'image/png')
        res.status(200).send(user.avatar)
    } catch (e) {
        console.log(e)
        res.status(404).send()
    }
}
