"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const encrypt = (senha, masterKey) => {
    const iv = crypto_1.default.randomBytes(16);
    const salt = crypto_1.default.randomBytes(64);
    const key = crypto_1.default.pbkdf2Sync(masterKey, salt, 2145, 32, "sha512");
    const cipher = crypto_1.default.createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([
        cipher.update(senha, "utf8"),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
};
exports.encrypt = encrypt;
const decrypt = (encryptSenha, masterKey) => {
    const bData = Buffer.from(encryptSenha, "base64");
    const salt = bData.slice(0, 64);
    const iv = bData.slice(64, 80);
    const tag = bData.slice(80, 96);
    const text = bData.slice(96);
    const key = crypto_1.default.pbkdf2Sync(masterKey, salt, 2145, 32, "sha512");
    const decipher = crypto_1.default.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    // encrypt the given text
    const decrypted = 
    // @ts-ignore
    decipher.update(text, "binary", "utf8") + decipher.final("utf8");
    return decrypted;
};
exports.decrypt = decrypt;
