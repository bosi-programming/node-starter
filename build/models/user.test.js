"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoConnection_1 = require("../mongoConnection");
const user_1 = require("./user");
describe('User model', () => {
    beforeAll(() => {
        mongoConnection_1.connectToDataBase();
    });
    afterAll((done) => {
        mongoose_1.default.disconnect(done);
    });
    test('User without authorName', () => {
        const user = new user_1.User({ userName: 'testUser', role: 'MAIN', mainAccount: 'testMain', password: 'banana' });
        expect(user.save).toThrowError();
    });
});
