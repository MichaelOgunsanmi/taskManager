const request = require('supertest');
const server = require('../app')

const {userOneId, userOne, setupDatabase} = require('./fixtures/db');
const User = require('../models/User');

describe('users', () => {
    beforeEach(setupDatabase);

    afterEach(async () => {
        await User.deleteMany({});
    });


    it('should signup a new user', async () => {
        const response = await request(server).post('/users').send({
            name: 'abcde',
            age: 1,
            email: 'ab@cd.efg',
            password: '1234567'
        }).expect(201);

        const user = await User.findById(response.body.user._id);
        expect(user).not.toBeNull();

        expect(response.body).toMatchObject({
            user: {
                name: 'abcde',
                age: 1,
                email: 'ab@cd.efg',
            },
            token: user.tokens[0].token
        });

        expect(user.password).not.toBe('1234567')
    });

    it('should login existing user', async () => {
        const response = await request(server).post('/users/login').send({
            email: userOne.email,
            password: userOne.password
        }).expect(200);

        const user = await User.findById(userOneId);
        expect(user).not.toBeNull();

        expect(response.body.token).toBe(user.tokens[1].token);
    });

    it('should prevent login of existing user if password is incorrect', async () => {
        await request(server).post('/users/login').send({
            email: userOne.email,
            password: 'incorrect'
        }).expect(400);
    });

    it('should prevent login if no user with email present in the database', async () => {
        await request(server).post('/users/login').send({
            email: 'not@in.db',
            password: 'incorrectp'
        }).expect(400);
    });

    it('should get current user profile', async () => {
        await request(server)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);
    });

    it('should get a 401 if no token passed before getting current user profile', async () => {
        await request(server)
            .get('/users/me')
            .send()
            .expect(401);
    });

    it('should get a 401 if invalid token passed before getting current user profile', async () => {
        await request(server)
            .get('/users/me')
            .set('Authorization', `Bearer abcd.efgh.ijkl`)
            .send()
            .expect(401);
    });

    it('should delete current user profile', async () => {
        await request(server)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);

        const user = await User.findById(userOneId);
        expect(user).toBeNull();
    });

    it('should get a 401 if no token passed before deleting current user profile', async () => {
        await request(server)
            .delete('/users/me')
            .send()
            .expect(401);
    });

    it('should get a 401 if invalid token passed before deleting current user profile', async () => {
        await request(server)
            .delete('/users/me')
            .set('Authorization', `Bearer abcd.efgh.ijkl`)
            .send()
            .expect(401);
    });

    it('should upload avatar image', async () => {
        await request(server)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200);

        const user = await User.findById(userOneId);
        expect(user.avatar).toEqual(expect.any(Buffer))
    });

    it('should update user data if valid fields are provided', async () => {
        const response = await request(server)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: 'updatedName',
            })
            .expect(200);

        const user = await User.findById(userOneId);
        expect(response.body.user.name).toEqual('updatedName')
    });

    it('should not update user data if invalid fields are provided', async () => {
        const response = await request(server)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                location: 'invalidValue'
            })
            .expect(400);
    });

});
