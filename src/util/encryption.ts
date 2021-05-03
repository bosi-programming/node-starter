import crypto from "crypto";

export const encrypt = (password: string, masterKey: string) => {
  const iv = crypto.randomBytes(16);

  const salt = crypto.randomBytes(64);

  const key = crypto.pbkdf2Sync(masterKey, salt, 2145, 32, "sha512");

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(password, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
};

export const decrypt = (encryptPassword: string, masterKey: string) => {
  const bData = Buffer.from(encryptPassword, "base64");

  const salt = bData.slice(0, 64);
  const iv = bData.slice(64, 80);
  const tag = bData.slice(80, 96);
  const text = bData.slice(96);

  const key = crypto.pbkdf2Sync(masterKey, salt, 2145, 32, "sha512");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  // encrypt the given text
  const decrypted =
    // @ts-ignore
    decipher.update(text, "binary", "utf8") + decipher.final("utf8");

  return decrypted;
};
