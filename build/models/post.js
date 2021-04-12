"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    authorUserName: {
        type: String,
        required: true,
    },
    mainAccount: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: false,
    },
});
postSchema.statics.build = (attr) => {
    return new exports.Post(attr);
};
exports.Post = mongoose_1.default.model('Post', postSchema);
