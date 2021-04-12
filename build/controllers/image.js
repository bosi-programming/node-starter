"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const verifyToken_1 = require("../util/verifyToken");
const binaryToBase64_1 = __importDefault(require("../util/binaryToBase64"));
const base64ToBinary_1 = __importDefault(require("../util/base64ToBinary"));
const image_1 = require("../models/image");
const upload = multer_1.default({ dest: 'uploads/' });
const imageRouter = express_1.default.Router();
imageRouter.post('/api/image', upload.single('image'), verifyToken_1.verifyJWT, async (req, res) => {
    try {
        const { imageName, user } = req.body;
        const userId = user._id;
        const imageExist = Boolean(await image_1.Image.findOne({ userId, imageName }));
        if (imageExist) {
            res.status(400).json({ message: 'Imagem já existente em nosso sistema' });
            return;
        }
        const image = binaryToBase64_1.default(`./uploads/${req.file.filename}`);
        const newImage = image_1.Image.build({ userId, imageName, image });
        await newImage.save();
        res.status(201).json(newImage);
    }
    catch (e) {
        res.status(400).json(e);
    }
});
imageRouter.get('/api/image', async (req, res) => {
    const { user } = req.body;
    const userId = user._id;
    const { imageName } = req.query;
    const images = imageName
        ? await image_1.Image.find({ userId, imageName: { $regex: imageName } })
        : await image_1.Image.find({ userId });
    if (images.length === 0) {
        res.status(404).json({ message: 'Nenhuma imagem encontrada em nosso sistema' });
        return;
    }
    res.status(200).json(images);
});
imageRouter.get('/api/image/:id', async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    const userId = user._id;
    const image = await image_1.Image.findOne({ _id: id, userId });
    if (image.length === 0) {
        res.status(404).json({ message: 'Nenhuma imagem encontrada em nosso sistema' });
        return;
    }
    const filePath = `${process.cwd()}/uploads/${image._id}`;
    try {
        base64ToBinary_1.default(image.image, filePath, res);
    }
    catch (e) {
        res.status(200).json(e);
    }
});
imageRouter.delete('/api/image/:id', async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    const userId = user._id;
    try {
        const deletedImage = await image_1.Image.deleteOne({ _id: id, userId });
        res.status(200).json(deletedImage);
    }
    catch (e) {
        res.status(404).json(e);
    }
});
exports.default = imageRouter;
