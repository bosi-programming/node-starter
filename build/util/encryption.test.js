"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encryption_1 = require("./encryption");
describe('Test encryption function', () => {
    test('Encrypt and decrypt functions', () => {
        expect(encryption_1.decrypt(encryption_1.encrypt('test', 'banana'), 'banana')).toBe('test');
    });
    test('Encrypt and decrypt functions', () => {
        expect(encryption_1.decrypt(encryption_1.encrypt('banana', 'banana'), 'banana')).not.toBe('test');
    });
});
