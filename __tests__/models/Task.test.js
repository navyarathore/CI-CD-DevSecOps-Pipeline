const Task = require('../../models/Task');
require('../setup');

describe('Task Model Test', () => {
  it('should create & save task successfully', async () => {
    const validTask = new Task({
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending'
    });
    const savedTask = await validTask.save();
    
    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe('Test Task');
    expect(savedTask.description).toBe('Test Description');
    expect(savedTask.status).toBe('pending');
  });

  it('should fail to create task without required field', async () => {
    const taskWithoutTitle = new Task({
      description: 'Test Description'
    });
    
    let err;
    try {
      await taskWithoutTitle.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(Error);
  });

  it('should default status to pending if not provided', async () => {
    const task = new Task({
      title: 'Test Task',
      description: 'Test Description'
    });
    const savedTask = await task.save();
    
    expect(savedTask.status).toBe('pending');
  });

  it('should only accept valid status values', async () => {
    const taskWithInvalidStatus = new Task({
      title: 'Test Task',
      description: 'Test Description',
      status: 'invalid-status'
    });
    
    let err;
    try {
      await taskWithInvalidStatus.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(Error);
  });

  it('should have timestamps', async () => {
    const task = new Task({
      title: 'Test Task',
      description: 'Test Description'
    });
    const savedTask = await task.save();
    
    expect(savedTask.createdAt).toBeDefined();
    expect(savedTask.updatedAt).toBeDefined();
  });
});
