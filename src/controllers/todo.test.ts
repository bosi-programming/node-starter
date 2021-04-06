import request from 'supertest';
import mongoose from 'mongoose';
import app, { server } from '../app';
import { connectToDataBase } from '../mongoConnection';

describe('Test the todo route', () => {
  beforeAll(() => {
    connectToDataBase();
  });
  afterAll((done) => {
    server.close(done);
    mongoose.disconnect(done);
  });

  let token = '';

  test('It should receive a 200 for a valid todo', async (done) => {
    await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ userName: 'test', password: '123456' })
      .then((res) => {
        token = res.body.token;
      })
      .catch((err) => {
        done(err);
      });
    await request(app)
      .post('/api/todo')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({ title: 'Test todo', description: 'Test description', date: '02-12-2020' })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a repeated todo', async (done) => {
    await request(app)
      .post('/api/todo')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({ title: 'Test todo', description: 'Test description', date: '02-12-2020' })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a invalid todo', async (done) => {
    await request(app)
      .post('/api/todo')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({ description: 'Test description', date: '02-12-2020' })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 200 for get todos', async (done) => {
    await request(app)
      .get('/api/todo')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send()
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 200 for put todo', async (done) => {
    await request(app)
      .put('/api/todo')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({ title: 'Test todo', newTitle: 'Test todo new', description: 'Test description', date: '02-12-2020' })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Test todo new');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 404 for put inexistent todo', async (done) => {
    await request(app)
      .put('/api/todo')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        title: 'Test inexistent todo',
        newTitle: 'Test todo new',
        description: 'Test description',
        date: '02-12-2020',
      })
      .then((res) => {
        expect(res.status).toBe(404);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for put todo with wrong data', async (done) => {
    await request(app)
      .put('/api/todo')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        title: 'Test todo new',
        newTitle: 'Test todo new',
        description: 'Test description',
        status: 'test',
        date: 'test wrong date',
      })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 200 for delete todo', async (done) => {
    await request(app)
      .delete('/api/todo')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({ title: 'Test todo new' })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 404 for delete inexistent todo', async (done) => {
    await request(app)
      .delete('/api/todo')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({ title: 'No Exist todo' })
      .then((res) => {
        expect(res.status).toBe(404);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
