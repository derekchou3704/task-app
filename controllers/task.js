const Task = require('../models/task')

module.exports.createTask = async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
}

// GET /tasks?completed=true
// GET /tasks?limit=2&skip=3 (limit is how many results at most to be shown, and skip is the page)
// GET /tasks?sortBy=createdAt:desc (stucture: [sort method][special symbol used for split][sort value]; ascending(default) = 1)
module.exports.getAllTasks = async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
}

module.exports.getTask = async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) return res.status(404).send()
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
}

module.exports.updateTask = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description', 'completed']
    
    const isValidOperation = updates.every(update =>  allowedUpdate.includes(update))
    if (!isValidOperation) return res.status(400).send({ error: 'Invalid Upadates' })

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send()

        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

module.exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send()
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
}
