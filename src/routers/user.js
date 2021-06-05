const express= require('express')
const User = require('../models/user')
const router = new express.Router()


router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}) // Provided by Mongoose
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id)
        if (!user) return res.status(404).send()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }   
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password', 'age']

    const isValidOperation = updates.every(update =>  allowedUpdate.includes(update))
    if (!isValidOperation) return res.status(400).send({ error: 'Invalid Upadates' })

    try {
       const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
       if (!user) return res.status(404).send()
       res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }   
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).send()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router