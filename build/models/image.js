"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const imageSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    imageName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});
imageSchema.statics.build = (attr) => {
    return new exports.Image(attr);
};
exports.Image = mongoose_1.default.model('Image', imageSchema);
