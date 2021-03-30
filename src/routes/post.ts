import express from 'express';

import { verifyJWT } from '../util/verifyToken';
import { Post } from '../models/post';

const postRouter = express.Router();

postRouter.post('/api/post', verifyJWT, async (req: any, res: any) => {
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
    res.status(200).json(newPost);
  } catch (e) {
    res.status(400).json(e);
  }
});
