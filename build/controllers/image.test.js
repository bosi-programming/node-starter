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
describe('Test the author route', () => {
    beforeAll(() => {
        mongoConnection_1.connectToDataBase();
    });
    afterAll((done) => {
        app_1.server.close(done);
        mongoose_1.default.disconnect(done);
    });
    let token;
    let imageId;
    test('It should receive a 200 for a new quote', async (done) => {
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
        await supertest_1.default(app_1.default)
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
