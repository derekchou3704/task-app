const app = require('./app') // everything else is duplicated in app.js

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})



