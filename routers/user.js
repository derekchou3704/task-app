const express= require('express')
const { auth, uploadAvatarPic, sendErrorMessage } = require('../middleware')
const { 
    createUser,
    login,
    logout,
    logoutAll,
    readProfile,
    updateProfile,
    deleteUser,
    uploadAvatar,
    deleteAvatar,
    checkAvatar
  } = require('../controllers/user')
const router = new express.Router()


router.post('/users', createUser)
router.post('/users/login', login)
router.post('/users/logout', auth, logout)
router.post('/users/logoutAll', auth, logoutAll)

router.route('/users/me')
    .get(auth, readProfile)
    .patch(auth, updateProfile)
    .delete(auth, deleteUser)

router.route('/users/me/avatar')
    .post(auth, uploadAvatarPic.single('avatar'), uploadAvatar, sendErrorMessage)
    .delete(auth, deleteAvatar, sendErrorMessage)

router.get('/users/:id/avatar', checkAvatar)

module.exports = router