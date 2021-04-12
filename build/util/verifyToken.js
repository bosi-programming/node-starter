"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const user_1 = require("../models/user");
const verifyJWT = async (req, res, next) => {
    const path = req.originalUrl;
    if (path === '/api/login' && req.method !== 'DELETE') {
        next();
        return;
    }
    else if (path === '/api/users' && req.method === 'POST') {
        next();
        return;
    }
    const token = req.headers['x-access-token'];
    let userId;
    if (!token)
        return res.status(401).json({ auth: false, message: 'No token provided.' });
    if (Array.isArray(token))
        return res.status(400).json({ auth: false, message: 'Something is wrong with your token, please log in again' });
    jsonwebtoken_1.default.verify(token, app_1.notSoSecret, function (err, decoded) {
        if (err) {
            return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        }
        userId = decoded.id;
    });
    try {
        const user = await user_1.User.findOne({ _id: userId });
        req.body.user = user;
        next();
    }
    catch (e) {
        res.status(400).json(e);
        next();
    }
};
exports.verifyJWT = verifyJWT;
