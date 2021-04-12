"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const binaryToBase64 = (filePath) => {
    try {
        const file = fs_1.default.readFileSync(filePath, { encoding: 'base64' });
        fs_1.default.unlinkSync(filePath);
        return file;
    }
    catch (e) {
        return e;
    }
};
exports.default = binaryToBase64;
