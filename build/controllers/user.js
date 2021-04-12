"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const encryption_1 = require("../util/encryption");
const checkForExistingUser_1 = require("../util/checkForExistingUser");
const user_1 = require("../models/user");
const userRouter = express_1.default.Router();
userRouter.post('/api/users', async (req, res) => {
    const { userName, authorName, role, mainAccount, password } = req.body;
    const hashedPassword = encryption_1.encrypt(password, 'banana');
    const isExistingUser = Boolean(await checkForExistingUser_1.checkForExistingUser(userName));
    if (isExistingUser) {
        res.status(400).json({ message: 'User already exist in database' });
        return;
    }
    try {
        const newUser = user_1.User.build({ userName, authorName, role, mainAccount, password: hashedPassword });
        await newUser.save();
        res.status(200).json(newUser);
    }
    catch (e) {
        res.status(400).json(e);
    }
});
userRouter.delete('/api/users', async (req, res) => {
    const { user, userName } = req.body;
    if (!user) {
        res.status(400).json({ message: 'Usuário não existe em nosso sistema' });
        return;
    }
    const userId = user._id;
    const deleteUser = await user_1.User.deleteOne({ _id: userId, userName });
    if (deleteUser.deletedCount === 0) {
        res.status(400).json({ message: 'Usuário não existe em nosso sistema' });
        return;
    }
    res.status(200).json({ ...deleteUser, message: 'Usuário deletado do sistema' });
});
exports.default = userRouter;
