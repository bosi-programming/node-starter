"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForExistingUser = void 0;
const user_1 = require("../models/user");
const checkForExistingUser = async (userName) => {
    const user = await user_1.User.findOne({ userName });
    if (!user || user.length === 0) {
        return null;
    }
    return user;
};
exports.checkForExistingUser = checkForExistingUser;
