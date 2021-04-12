"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const media_1 = require("../models/media");
const mediaRouter = express_1.default.Router();
mediaRouter.post('/api/media', async (req, res) => {
    const { mediaName, authorId, publisher, dateOfPublication, typeOfMedia, link } = req.body;
    const mediaExist = Boolean(await media_1.Media.findOne({ mediaName, authorId, typeOfMedia }));
    if (mediaExist) {
        res.status(400).json({ message: 'Mídia já existente em nosso sistema' });
        return;
    }
    try {
        const newMedia = media_1.Media.build({
            mediaName,
            authorId,
            publisher,
            dateOfPublication,
            typeOfMedia,
            link,
        });
        await newMedia.save();
        res.status(200).json(newMedia);
    }
    catch (e) {
        res.status(400).json(e);
    }
});
mediaRouter.get('/api/media', async (req, res) => {
    const { mediaName } = req.query;
    const medias = mediaName
        ? await media_1.Media.find({
            mediaName: { $regex: mediaName },
        })
        : await media_1.Media.find();
    if (medias.length === 0) {
        res.status(404).json({ message: 'Nenhuma mídia achada, crie uma mídia nova para vê-la aqui' });
    }
    else {
        res.status(200).json(medias);
    }
});
mediaRouter.get('/api/media/:id', async (req, res) => {
    const { id } = req.params;
    const media = await media_1.Media.findOne({ _id: id });
    if (media.length === 0) {
        res.status(404).json({ message: 'Mídia não encontrada' });
    }
    else {
        res.status(200).json(media);
    }
});
mediaRouter.delete('/api/media/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const media = await media_1.Media.deleteOne({ _id: id });
        if (media.deletedCount === 0) {
            res.status(404).json({ message: 'Mídia não encontrado' });
        }
        else {
            res.status(200).json(media);
        }
    }
    catch (e) {
        res.status(404).json(e);
    }
});
exports.default = mediaRouter;
