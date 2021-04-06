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
  // Fake author and media on database
  let authorId: string = '606c67eadc162c6290a24e35';
  let mediaId: string = '606c6866dc162c6290a24e36';
  let quoteId: string;

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
      .post('/api/quote')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        authorId,
        mediaId,
        where: 'p. 15-20',
        content: 'Just a test quote',
      })
      .then((res) => {
        expect(res.status).toBe(200);
        quoteId = res.body._id;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a repeated quote', async (done) => {
    await request(app)
      .post('/api/quote')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        authorId,
        mediaId,
        where: 'p. 15-20',
        content: 'Just a test quote',
      })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a invalid quote', async (done) => {
    await request(app)
      .post('/api/quote')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        authorId,
        mediaId,
        where: 'p. 15-20',
      })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 200 for get quotes', async (done) => {
    await request(app)
      .get('/api/quote')
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

  test('It should receive a 200 for get quotes with query params', async (done) => {
    await request(app)
      .get(`/api/quote?authorId=${authorId}&mediaId=${mediaId}&content=Just%20a%20test%20quote`)
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

  test('It should receive a 200 for get quote with id', async (done) => {
    await request(app)
      .get(`/api/quote/${quoteId}`)
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

  test('It should receive a 200 for delete quote with id', async (done) => {
    await request(app)
      .delete(`/api/quote/${quoteId}`)
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

  test('It should receive a 404 for delete quote with  wrong id', async (done) => {
    await request(app)
      .delete(`/api/quote/${quoteId}wrong`)
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
