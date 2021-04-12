"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quote = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const quoteSchema = new mongoose_1.default.Schema({
    authorId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    mediaId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    where: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});
quoteSchema.statics.build = (attr) => {
    return new exports.Quote(attr);
};
exports.Quote = mongoose_1.default.model('Quote', quoteSchema);
