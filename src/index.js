const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// // mantaince middleware
// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

const User = require('./models/user')
const Task = require('./models/task')

const main = async () => {
    const user = await User.findById('60bf380e9db56c4f54d4899a')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

main()