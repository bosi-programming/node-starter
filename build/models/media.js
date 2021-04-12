"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var EnumMedia;
(function (EnumMedia) {
    EnumMedia[EnumMedia["BOOK"] = 0] = "BOOK";
    EnumMedia[EnumMedia["ARTICLE"] = 1] = "ARTICLE";
    EnumMedia[EnumMedia["BLOGPOST"] = 2] = "BLOGPOST";
    EnumMedia[EnumMedia["MOVIE"] = 3] = "MOVIE";
    EnumMedia[EnumMedia["WEBVIDEO"] = 4] = "WEBVIDEO";
})(EnumMedia || (EnumMedia = {}));
const mediaSchema = new mongoose_1.default.Schema({
    mediaName: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    publisher: {
        type: String,
        required: false,
    },
    dateOfPublication: {
        type: Date,
        required: true,
    },
    typeOfMedia: {
        type: String,
        enum: ['BOOK', 'ARTICLE', 'BLOGPOST', 'MOVIE', 'WEBVIDEO'],
        required: true,
    },
});
mediaSchema.statics.build = (attr) => {
    return new exports.Media(attr);
};
exports.Media = mongoose_1.default.model('Media', mediaSchema);
