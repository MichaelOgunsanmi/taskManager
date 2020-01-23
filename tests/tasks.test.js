const request = require('supertest');
const server = require('../app');

const {userOneId, userOne, userTwo, taskOne, setupDatabase} = require('./fixtures/db');
const Task = require('../models/Task');

describe('tasks', () => {
    beforeEach(setupDatabase);

    it('should not fail', async () => {
        const response = await request(server)
            .post('/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                description: 'from my test'
            })
            .expect(201);

        const task = Task.findById(response.body._id);
        expect(task).not.toBeNull();
        expect(task.completed).toBeFalsy();
    });

    it('should get all tasks for a given user', async () => {
        const response = await request(server)
            .get('/tasks/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);


        const task = await Task.find({owner: userOne._id});
        expect(task).not.toBeNull();
        expect(task.length).toBe(2);
    });

    it('should prevent userTwo from deleting userOne Tasks', async () => {
        const response = await request(server)
            .delete(`/tasks/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(400);


        const task = await Task.findById( taskOne._id);
        expect(task).not.toBeNull();
    });
});