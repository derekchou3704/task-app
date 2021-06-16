const jwt = require('jsonwebtoken')
const multer = require('multer')
const User = require('./models/user')

module.exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRETE)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) throw new Error()
        req.token = token
        req.user = user
        
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}

module.exports.uploadAvatarPic = multer({ 
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

module.exports.sendErrorMessage = (err, req, res, next) => {
    res.status(400).send({ error: err.message })
}