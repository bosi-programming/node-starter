"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quote_1 = require("../models/quote");
const quoteRouter = express_1.default.Router();
quoteRouter.post('/api/quote', async (req, res) => {
    const { authorId, mediaId, where, content } = req.body;
    const quoteExist = Boolean(await quote_1.Quote.findOne({ authorId, mediaId, where, content }));
    if (quoteExist) {
        res.status(400).json({ message: 'Citação já existente em nosso sistema' });
        return;
    }
    try {
        const newQuote = quote_1.Quote.build({
            authorId,
            mediaId,
            where,
            content,
        });
        await newQuote.save();
        res.status(200).json(newQuote);
    }
    catch (e) {
        res.status(400).json(e);
    }
});
quoteRouter.get('/api/quote', async (req, res) => {
    const { content, authorId, mediaId } = req.query;
    const quotes = content
        ? await quote_1.Quote.find({
            authorId,
            mediaId,
            content: { $regex: content },
        })
        : await quote_1.Quote.find();
    if (quotes.length === 0) {
        res.status(404).json({ message: 'Nenhuma citação achada, crie uma citação nova para vê-la aqui' });
    }
    else {
        res.status(200).json(quotes);
    }
});
quoteRouter.get('/api/quote/:id', async (req, res) => {
    const { id } = req.params;
    const quote = await quote_1.Quote.findOne({ _id: id });
    if (quote.length === 0) {
        res.status(404).json({ message: 'Citação não encontrada' });
    }
    else {
        res.status(200).json(quote);
    }
});
quoteRouter.delete('/api/quote/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const quote = await quote_1.Quote.deleteOne({ _id: id });
        if (quote.deletedCount === 0) {
            res.status(404).json({ message: 'Citação não encontrado' });
        }
        else {
            res.status(200).json(quote);
        }
    }
    catch (e) {
        res.status(404).json(e);
    }
});
exports.default = quoteRouter;
