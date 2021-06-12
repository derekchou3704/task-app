const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
    name: 'Mike',
    email: 'mike@example.com',
    password: 'Example123!'
}

beforeEach( async () => {
    await User.deleteMany()
    await new User(userOne).save()  
})


test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: 'Example123!'
    }).expect(201)
}) 

test('Should login existing user', async () => {
    await request(app).post('/users/login')
        .send({ email, password } = userOne)
        .expect(200)
})

test('Should not login non-existing user', async () => {
    await request(app).post('/users/login')
        .send({ 
            email: userOne.email, 
            password: 'Notthepassword' 
        })
        .expect(400)
})