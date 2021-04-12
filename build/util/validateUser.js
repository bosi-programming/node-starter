"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const checkForExistingUser_1 = require("./checkForExistingUser");
const validateUser = async (userName) => {
    const user = await checkForExistingUser_1.checkForExistingUser(userName);
    if (!user) {
        throw { message: 'User not found', status: 400 };
    }
    return user;
};
exports.validateUser = validateUser;
