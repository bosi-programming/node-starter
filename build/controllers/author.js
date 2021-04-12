"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const author_1 = require("../models/author");
const authorRouter = express_1.default.Router();
authorRouter.post('/api/author', async (req, res) => {
    const { firstName, lastName, abreviation } = req.body;
    const authorExist = Boolean(await author_1.Author.findOne({ firstName, lastName }));
    if (authorExist) {
        res.status(400).json({ message: 'Autor já existente em nosso sistema' });
        return;
    }
    try {
        const newAuthor = author_1.Author.build({
            firstName,
            lastName,
            abreviation,
        });
        await newAuthor.save();
        res.status(200).json(newAuthor);
    }
    catch (e) {
        res.status(400).json(e);
    }
});
authorRouter.get('/api/author', async (req, res) => {
    const { firstName, lastName } = req.query;
    const authors = firstName && lastName
        ? await author_1.Author.find({
            firstName: { $regex: firstName },
            lastName: { $regex: lastName },
        })
        : await author_1.Author.find();
    if (authors.length === 0) {
        res.status(404).json({ message: 'Nenhum autor achado, crie um autor nova para vê-lo aqui' });
    }
    else {
        res.status(200).json(authors);
    }
});
authorRouter.get('/api/author/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const author = await author_1.Author.findOne({ _id: id });
        if (author.length === 0) {
            res.status(404).json({ message: 'Autor não encontrado' });
        }
        else {
            res.status(200).json(author);
        }
    }
    catch (e) {
        res.status(404).json(e);
    }
});
authorRouter.delete('/api/author/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const author = await author_1.Author.deleteOne({ _id: id });
        if (author.deletedCount === 0) {
            res.status(404).json({ message: 'Autor não encontrado' });
        }
        else {
            res.status(200).json(author);
        }
    }
    catch (e) {
        res.status(404).json(e);
    }
});
exports.default = authorRouter;
