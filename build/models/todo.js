"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var todoStatus;
(function (todoStatus) {
    todoStatus[todoStatus["NAOINICIADO"] = 0] = "NAOINICIADO";
    todoStatus[todoStatus["EMPROGRESSO"] = 1] = "EMPROGRESSO";
    todoStatus[todoStatus["COMPLETO"] = 2] = "COMPLETO";
})(todoStatus || (todoStatus = {}));
const todoSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['NAOINICIADO', 'EMPROGRESSO', 'COMPLETO'],
        required: false,
        default: 'NAOINICIADO',
    },
});
todoSchema.statics.build = (attr) => {
    return new exports.Todo(attr);
};
exports.Todo = mongoose_1.default.model('Todo', todoSchema);
