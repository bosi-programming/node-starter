"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const base64ToBinary = (image, filePath, res) => {
    fs_1.default.writeFile(filePath, image, { encoding: 'base64' }, (e) => {
        if (e) {
            res.status(400).json({ message: 'Error trying to get image', error: e });
        }
        else {
            sendFile(filePath, res);
        }
    });
};
const sendFile = (filePath, res) => {
    res.status(200).sendFile(filePath, { headers: { 'Content-Type': 'image/any' } }, (e) => {
        if (e) {
            res.status(400).json({ message: 'Error trying to get image', error: e });
        }
        else {
            fs_1.default.unlinkSync(filePath);
        }
    });
};
exports.default = base64ToBinary;
