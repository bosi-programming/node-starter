import request from 'supertest';
import mongoose from 'mongoose';
import app, { server } from '../app';
import { connectToDataBase } from '../mongoConnection';

describe('Test the login route', () => {
  beforeAll(() => {
    connectToDataBase();
  });
  afterAll((done) => {
    server.close(done);
    mongoose.disconnect(done);
  });
  test('It should receive a 200 for a fake user', (done) => {
    request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ userName: 'test', password: '123456' })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a fake user with wrong password', (done) => {
    request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ userName: 'test', password: '12345' })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Wrong password");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a non-existing user', (done) => {
    request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ userName: 'nonExisting', password: '123456' })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a call without password', (done) => {
    request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ userName: 'test' })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Please write a password");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
