const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'ab123' }, 'anySeriesOfCharactersWillWork', { expiresIn: '1 second' })
//     console.log(token)

//     const data = jwt.verify(token, 'anySeriesOfCharactersWillWork')
//     console.log(data)
// }

// myFunction()