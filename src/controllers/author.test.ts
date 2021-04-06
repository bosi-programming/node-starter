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

  let token = '';

  test('It should receive a 200 for a valid author', async (done) => {
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
      .post('/api/author')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({ firstName: 'Felipe', lastName: 'Azevedo Bosi', abreviation: 'F.A.Bosi' })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a repeated author', async (done) => {
    await request(app)
      .post('/api/author')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({ firstName: 'Felipe', lastName: 'Azevedo Bosi', abreviation: 'F.A.Bosi' })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a invalid author', async (done) => {
    await request(app)
      .post('/api/author')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({ firstName: 'Felipe', abreviation: 'F.A.Bosi' })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 200 for get authors', async (done) => {
    await request(app)
      .get('/api/author')
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

  let authorId: string;
  test('It should receive a 200 for get author with query', async (done) => {
    await request(app)
      .get('/api/author?firstName=Felipe&lastName=Azevedo%20Bosi')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send()
      .then((res) => {
        expect(res.status).toBe(200);
        authorId = res.body[0]._id;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 200 for get author with id', async (done) => {
    await request(app)
      .get(`/api/author/${authorId}`)
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

  test('It should receive a 200 for delete author with id', async (done) => {
    await request(app)
      .delete(`/api/author/${authorId}`)
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
  test('It should receive a 404 for delete author with wrong id', async (done) => {
    await request(app)
      .delete(`/api/author/${authorId}wrong`)
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
