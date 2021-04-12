"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todo_1 = require("../models/todo");
const todoRouter = express_1.default.Router();
todoRouter.post('/api/todo', async (req, res) => {
    const { title, description, date, status, user } = req.body;
    const userId = user._id;
    const userName = user.userName;
    const todoExist = Boolean(await todo_1.Todo.findOne({ userId, title }));
    if (todoExist) {
        res.status(400).json({ message: 'Tarefa já existente em nosso sistema' });
        return;
    }
    const finalDate = new Date(date);
    const finalStatus = status || undefined;
    try {
        const newTodo = todo_1.Todo.build({
            userId,
            userName,
            title,
            description,
            date: finalDate,
            status: finalStatus,
        });
        await newTodo.save();
        res.status(200).json(newTodo);
    }
    catch (e) {
        res.status(400).json(e);
    }
});
todoRouter.get('/api/todo', async (req, res) => {
    const { user } = req.body;
    const userId = user._id;
    try {
        const todos = await todo_1.Todo.find({ userId });
        res.status(200).json(todos);
    }
    catch (e) {
        res.status(400).json(e);
    }
});
todoRouter.delete('/api/todo', async (req, res) => {
    const { user, title } = req.body;
    const userId = user._id;
    const deleteTodo = await todo_1.Todo.deleteOne({ userId, title });
    if (deleteTodo.deletedCount === 0) {
        res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    else {
        res.status(200).json({ ...deleteTodo, message: 'Tarefa deletada' });
    }
});
todoRouter.put('/api/todo', async (req, res) => {
    const { title, newTitle, description, date, status, user } = req.body;
    const userId = user._id;
    const userName = user.userName;
    const todoExist = await todo_1.Todo.findOne({ userId, title });
    if (!Boolean(todoExist)) {
        res.status(404).json({ message: 'Tarefa inexistente em nosso sistema' });
        return;
    }
    const finalDate = date ? new Date(date) : todoExist.data;
    const finalTitle = newTitle ? newTitle : title;
    const finalStatus = status ? status : todoExist.status;
    const finalDescription = description ? description : todoExist.description;
    try {
        const updateTodo = await todo_1.Todo.findOneAndUpdate({ userId, title }, {
            userId,
            userName,
            title: finalTitle,
            description: finalDescription,
            date: finalDate,
            status: finalStatus,
        }, { new: true });
        res.status(200).json(updateTodo);
    }
    catch (e) {
        res.status(400).json(e);
    }
});
exports.default = todoRouter;
