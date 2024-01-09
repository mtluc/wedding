import getConfig from "next/config";

const crypto = require("crypto");
const { serverRuntimeConfig } = getConfig();
export const encrypt = (text: string) => {
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(serverRuntimeConfig.privateKey,'hex'), Buffer.from(serverRuntimeConfig.publicKey,'hex'));
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};

export const decrypt = (text: string) => {
  let encryptedText = Buffer.from(text, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(serverRuntimeConfig.privateKey,'hex'), Buffer.from(serverRuntimeConfig.publicKey,'hex'));
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
