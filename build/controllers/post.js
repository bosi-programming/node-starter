"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = require("../models/post");
const postRouter = express_1.default.Router();
postRouter.post('/api/post', async (req, res) => {
    const { title, content, date, user } = req.body;
    const userId = user._id;
    const authorUserName = user.userName;
    const { authorName, mainAccount } = user;
    const postExist = Boolean(await post_1.Post.findOne({ userId, title }));
    if (postExist) {
        res.status(400).json({ message: 'Post já existente em nosso sistema' });
        return;
    }
    const finalDate = new Date(date);
    try {
        const newPost = post_1.Post.build({
            userId,
            authorUserName,
            authorName,
            mainAccount,
            date: finalDate,
            title,
            content,
        });
        await newPost.save();
        res.status(201).json(newPost);
    }
    catch (e) {
        res.status(400).json(e);
    }
});
postRouter.get('/api/post', async (req, res) => {
    const { user } = req.body;
    const userId = user._id;
    const posts = await post_1.Post.find({ userId });
    if (posts.length === 0) {
        res.status(404).json({ message: 'Nenhuma postagem achada, crie uma postagem nova para vê-la aqui' });
    }
    else {
        res.status(200).json(posts);
    }
});
postRouter.get('/api/post/:id', async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    const userId = user._id;
    const post = await post_1.Post.findOne({ userId, _id: id });
    if (post.length === 0) {
        res.status(404).json({ message: 'Postagem não encontrada' });
    }
    else {
        res.status(200).json(post);
    }
});
postRouter.patch('api/post/:id', async (req, res) => {
    const { id } = req.params;
    const { user, title, content } = req.body;
    const userId = user._id;
    const post = await post_1.Post.findOne({ userId, _id: id });
    if (post.length === 0) {
        res.status(404).json({ message: 'Postagem não encontrada' });
    }
    else {
        try {
            post.title = title || post.title;
            post.content = content || post.content;
            const patchedPost = post.save();
            res.status(200).json(patchedPost);
        }
        catch (e) {
            res.status(400).json(e);
        }
    }
});
postRouter.delete('/api/post/:id', async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    const userId = user._id;
    try {
        const deletedPost = await post_1.Post.deleteOne({ userId, _id: id });
        res.status(200).json(deletedPost);
    }
    catch (e) {
        res.status(404).json(e);
    }
});
exports.default = postRouter;
