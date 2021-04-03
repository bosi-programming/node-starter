import request from 'supertest';
import mongoose from 'mongoose';
import app, { server } from '../app';
import { connectToDataBase } from '../mongoConnection';

describe('Test the user route', () => {
  beforeAll(() => {
    connectToDataBase();
  });
  afterAll((done) => {
    server.close(done);
    mongoose.disconnect(done);
  });

  test('It should receive a 200 for a valid fake new user', async (done) => {
    await request(app)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send({ userName: 'fakeNewUser', authorName: 'fakeNewAuthor', role: 'MAIN', mainAccount: 'fakeNewUser', password: '123456' })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a invalid fake new user', async (done) => {
    await request(app)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send({ userName: 'fakeNewUser', role: 'MAIN', mainAccount: 'fakeNewUser', password: '123456' })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

    let token = '';
  test('It should receive a 200 for delete a valid user', async (done) => {
    await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ userName: 'fakeNewUser', password: '123456' })
      .then((res) => {
        token = res.body.token;
      })
      .catch((err) => {
        done(err);
      });
    await request(app)
      .delete('/api/users')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({ userName: 'fakeNewUser' })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for delete an invalid user', async (done) => {
    await request(app)
      .delete('/api/users')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({ userName: 'notFakeNewUser' })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for an existing user', async (done) => {
    await request(app)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send({ userName: 'test', role: 'MAIN', mainAccount: 'fakeNewUser', password: '123456' })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
})
