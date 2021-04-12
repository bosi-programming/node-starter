"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var roleEnum;
(function (roleEnum) {
    roleEnum[roleEnum["MAIN"] = 0] = "MAIN";
    roleEnum[roleEnum["WRITER"] = 1] = "WRITER";
})(roleEnum || (roleEnum = {}));
const userSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['MAIN', 'WRITER'],
        required: true,
    },
    mainAccount: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
userSchema.statics.build = (attr) => {
    return new exports.User(attr);
};
exports.User = mongoose_1.default.model('User', userSchema);
