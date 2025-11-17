const taskController = require('../../controllers/taskController');
const Task = require('../../models/Task');
require('../setup');

describe('Task Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      req.body = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending'
      };

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          description: 'Test Description'
        })
      );
    });

    it('should handle errors when creating task', async () => {
      req.body = {}; // Missing required fields

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });
  });

  describe('getTasks', () => {
    it('should retrieve all tasks', async () => {
      await Task.create([
        { title: 'Task 1', description: 'Desc 1' },
        { title: 'Task 2', description: 'Desc 2' }
      ]);

      await taskController.getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ title: 'Task 1' }),
          expect.objectContaining({ title: 'Task 2' })
        ])
      );
    });

    it('should return empty array when no tasks exist', async () => {
      await taskController.getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getTaskById', () => {
    it('should retrieve a task by id', async () => {
      const task = await Task.create({
        title: 'Task 1',
        description: 'Desc 1'
      });

      req.params.id = task._id.toString();

      await taskController.getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Task 1'
        })
      );
    });

    it('should return 404 for non-existent task', async () => {
      req.params.id = '507f1f77bcf86cd799439011';

      await taskController.getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const task = await Task.create({
        title: 'Task 1',
        description: 'Desc 1'
      });

      req.params.id = task._id.toString();
      req.body = {
        title: 'Updated Task',
        status: 'completed'
      };

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Updated Task',
          status: 'completed'
        })
      );
    });

    it('should return 404 when updating non-existent task', async () => {
      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { title: 'Updated Task' };

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const task = await Task.create({
        title: 'Task 1',
        description: 'Desc 1'
      });

      req.params.id = task._id.toString();

      await taskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('should return 404 when deleting non-existent task', async () => {
      req.params.id = '507f1f77bcf86cd799439011';

      await taskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
