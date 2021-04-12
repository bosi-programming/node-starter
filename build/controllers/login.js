"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const encryption_1 = require("../util/encryption");
const validateUser_1 = require("../util/validateUser");
const loginRouter = express_1.default.Router();
const validatePassword = (user, password) => {
    if (!password) {
        throw { message: 'Please write a password', status: 400 };
    }
    const decriptedPassword = encryption_1.decrypt(user.password, 'banana');
    if (password !== decriptedPassword) {
        throw { message: 'Wrong password', status: 400 };
    }
};
loginRouter.post('/api/login', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await validateUser_1.validateUser(userName);
        validatePassword(user, password);
        const userId = user._id;
        const token = jsonwebtoken_1.default.sign({ id: userId }, app_1.notSoSecret, {
            expiresIn: '2 days',
        });
        res.status(200).json({ token });
    }
    catch (e) {
        res.status(e.status).json(e);
    }
});
exports.default = loginRouter;
