import express, { Request, Response } from 'express';
const html_to_pdf = require('html-pdf-node');

import { Post } from '../models/post';

const postRouter = express.Router();

postRouter.patch('/api/post/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user, title, content } = req.body;

  const userId = user._id;

  try {
    const post = await Post.findOne({ userId, _id: id });

    console.log(post);

    if (post.length === 0) {
      res.status(404).json({ message: 'Postagem não encontrada' });
    } else {
      post.title = title || post.title;
      post.content = content || post.content;

      const patchedPost = post.save();
      res.status(200).json(patchedPost);
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

postRouter.get('/api/post/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;

  const userId = user._id;

  const post = await Post.findOne({ userId, _id: id });

  if (post.length === 0) {
    res.status(404).json({ message: 'Postagem não encontrada' });
  } else {
    res.status(200).json(post);
  }
});

postRouter.get('/api/post/download/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findOne({ _id: id });
  if (post.length === 0) {
    res.status(404).json({ message: 'Postagem não encontrada' });
  } else {
    const options = { format: 'A4', margin: { top: '3cm', left: '3cm', bottom: '2cm', right: '2cm' } };

    const file = { content: `<h1>${post.title}</h1>` + post.content };

    html_to_pdf.generatePdf(file, options).then((pdfBuffer: any) => {
      console.log('PDF Buffer:-', pdfBuffer);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${post.title}.pdf`);
      res.status(200).send(pdfBuffer);
    });
  }
});

postRouter.delete('/api/post/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;

  const userId = user._id;

  try {
    const deletedPost = await Post.deleteOne({ userId, _id: id });
    res.status(200).json(deletedPost);
  } catch (e) {
    res.status(404).json(e);
  }
});

postRouter.get('/api/post', async (req: Request, res: Response) => {
  const { user } = req.body;

  const userId = user._id;

  const posts = await Post.find({ userId });

  if (posts.length === 0) {
    res.status(404).json({ message: 'Nenhuma postagem achada, crie uma postagem nova para vê-la aqui' });
  } else {
    res.status(200).json(posts);
  }
});

postRouter.post('/api/post', async (req: Request, res: Response) => {
  const { title, content, date, user } = req.body;

  const userId = user._id;
  const authorUserName = user.userName;
  const { authorName, mainAccount } = user;

  const postExist = Boolean(await Post.findOne({ userId, title }));

  if (postExist) {
    res.status(400).json({ message: 'Post já existente em nosso sistema' });
    return;
  }

  const finalDate = new Date(date);

  try {
    const newPost = Post.build({
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
  } catch (e) {
    res.status(400).json(e);
  }
});

export default postRouter;
