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
  let authorId: string = "606c67eadc162c6290a24e35";

  test('It should receive a 200 for a valid media', async (done) => {
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
      .post('/api/media')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        mediaName: 'O habitante e o habitat : a casa senhorial da Corte, da abertura dos portos ao fim do Império',
        authorId,
        dateOfPublication: '03-10-2015',
        typeOfMedia: 'BOOK',
        link: 'http://repositorio.ufes.br/handle/10/4434',
      })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a repeated media', async (done) => {
    await request(app)
      .post('/api/media')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        mediaName: 'O habitante e o habitat : a casa senhorial da Corte, da abertura dos portos ao fim do Império',
        authorId,
        dateOfPublication: '03-10-2015',
        typeOfMedia: 'BOOK',
        link: 'http://repositorio.ufes.br/handle/10/4434',
      })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 400 for a invalid media', async (done) => {
    await request(app)
      .post('/api/media')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        mediaName: 'O habitante: a casa senhorial da Corte, da abertura dos portos ao fim do Império',
        authorId,
        dateOfPublication: '03-10-2015',
        link: 'http://repositorio.ufes.br/handle/10/4434',
      })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 200 for get medias', async (done) => {
    await request(app)
      .get('/api/media')
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

  let mediaId: string;
  test('It should receive a 200 for get media with query', async (done) => {
    await request(app)
      .get('/api/media?mediaName=O%20habitante')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send()
      .then((res) => {
        expect(res.status).toBe(200);
        mediaId = res.body[0]._id;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 200 for get mediaId with id', async (done) => {
    await request(app)
      .get(`/api/media/${mediaId}`)
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

  test('It should receive a 200 for delete mediaId with id', async (done) => {
    await request(app)
      .delete(`/api/media/${mediaId}`)
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

  test('It should receive a 404 for delete media with wrong id', async (done) => {
    await request(app)
      .delete(`/api/media/${mediaId}wrong`)
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
