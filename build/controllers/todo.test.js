"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importStar(require("../app"));
const mongoConnection_1 = require("../mongoConnection");
describe('Test the todo route', () => {
    beforeAll(() => {
        mongoConnection_1.connectToDataBase();
    });
    afterAll((done) => {
        app_1.server.close(done);
        mongoose_1.default.disconnect(done);
    });
    let token = '';
    test('It should receive a 200 for a valid todo', async (done) => {
        await supertest_1.default(app_1.default)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send({ userName: 'test', password: '123456' })
            .then((res) => {
            token = res.body.token;
        })
            .catch((err) => {
            done(err);
        });
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
