const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'Example123!',
    tokens:[{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRETE)
    }]
}

beforeEach( async () => {
    await User.deleteMany()
    await new User(userOne).save()  
})


test('Should signup a new user', async () => {
    const response = await request(app).post('/users')
        .send({
            name: 'Andrew',
            email: 'andrew@example.com',
            password: 'Example123!'
        }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions anout the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Andrew',
            email: 'andrew@example.com'
        },
        token: user.tokens[0].token
        
    })
    expect(user.password).not.toBe('1234567')
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

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete authorized user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    // Validate user is removed
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete unauthorized user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})




