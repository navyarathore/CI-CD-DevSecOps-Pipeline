const request = require('supertest');
const app = require('../../app');
const Task = require('../../models/Task');
require('../setup');

describe('Task Routes Test', () => {
  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'New Task',
          description: 'Task Description',
          status: 'pending'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe('New Task');
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          description: 'Task Description'
        });

      expect(res.statusCode).toBe(400);
    });

    it('should create task with default pending status', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'New Task',
          description: 'Task Description'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('pending');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await Task.create([
        { title: 'Task 1', description: 'Desc 1', status: 'pending' },
        { title: 'Task 2', description: 'Desc 2', status: 'completed' }
      ]);
    });

    it('should get all tasks', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should return empty array when no tasks exist', async () => {
      await Task.deleteMany({});
      const res = await request(app).get('/api/tasks');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should get a task by id', async () => {
      const task = await Task.create({
        title: 'Task 1',
        description: 'Desc 1',
        status: 'pending'
      });

      const res = await request(app).get(`/api/tasks/${task._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Task 1');
      expect(res.body._id).toBe(task._id.toString());
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/tasks/${fakeId}`);

      expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid task id', async () => {
      const res = await request(app).get('/api/tasks/invalid-id');

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const task = await Task.create({
        title: 'Task 1',
        description: 'Desc 1',
        status: 'pending'
      });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({
          title: 'Updated Task',
          status: 'completed'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Updated Task');
      expect(res.body.status).toBe('completed');
    });

    it('should return 404 when updating non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .send({
          title: 'Updated Task'
        });

      expect(res.statusCode).toBe(404);
    });

    it('should partially update a task', async () => {
      const task = await Task.create({
        title: 'Task 1',
        description: 'Desc 1',
        status: 'pending'
      });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({
          status: 'in-progress'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Task 1');
      expect(res.body.status).toBe('in-progress');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await Task.create({
        title: 'Task 1',
        description: 'Desc 1',
        status: 'pending'
      });

      const res = await request(app).delete(`/api/tasks/${task._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBeDefined();
      
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('should return 404 when deleting non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).delete(`/api/tasks/${fakeId}`);

      expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid task id', async () => {
      const res = await request(app).delete('/api/tasks/invalid-id');

      expect(res.statusCode).toBe(400);
    });
  });
});
