"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const authorSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    abreviation: {
        type: String,
        required: true,
    },
});
authorSchema.statics.build = (attr) => {
    return new exports.Author(attr);
};
exports.Author = mongoose_1.default.model('Author', authorSchema);
