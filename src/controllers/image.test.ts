import request from 'supertest';
import mongoose from 'mongoose';
import app, { server } from '../app';
import { connectToDataBase } from '../mongoConnection';

describe('Test the author route', () => {
  beforeAll(() => {
    connectToDataBase();
  });
  afterAll((done) => {
    server.close(done);
    mongoose.disconnect(done);
  });

  let token: string;
  let imageId: string;

  test('It should receive a 200 for a new quote', async (done) => {
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
      .post('/api/image')
      .set('x-access-token', token)
      .attach('image', process.env.PWD + '/test_files/testImage.png')
      .field('imageName', 'test image')
      .then((res) => {
        expect(res.status).toBe(201);
        imageId = res.body._id;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a repeated image', async (done) => {
    await request(app)
      .post('/api/image')
      .set('x-access-token', token)
      .attach('image', process.env.PWD + '/test_files/testImage.png')
      .field('imageName', 'test image')
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 200 for get images', async (done) => {
    await request(app)
      .get('/api/image')
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

  test('It should receive a 200 for get image with query', async (done) => {
    await request(app)
      .get('/api/image?imageName=test')
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

  test('It should receive a 200 for get imageId with id', async (done) => {
    await request(app)
      .get(`/api/image/${imageId}`)
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

  test('It should receive a 200 for delete imageId with id', async (done) => {
    await request(app)
      .delete(`/api/image/${imageId}`)
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

  test('It should receive a 404 for delete image with wrong id', async (done) => {
    await request(app)
      .delete(`/api/image/${imageId}wrong`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send()
      .then((res) => {
        expect(res.status).toBe(404);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
