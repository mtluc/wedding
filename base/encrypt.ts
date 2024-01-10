import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
const crypto = require("crypto");
import { mode, AES, enc } from "crypto-js";

export const encrypt = (text: string) => {
  const publicKey = crypto.randomBytes(16);

  const encrypted = AES.encrypt(
    text || "",
    `${serverRuntimeConfig.privateKey}${publicKey.toString("hex")}`,
    {
      mode: mode.CBC,
    }
  ).toString();
  return `${publicKey.toString("hex")}.${encrypted}`;
};

export const decrypt = (text: string) => {
  try {
    let [publicKey,_text] = text.split(".");
    let decrypted = AES.decrypt(
      _text || "",
      `${serverRuntimeConfig.privateKey}${publicKey}`,
      {
        mode: mode.CBC,
      }
    ).toString(enc.Utf8);
    return decrypted;
  } catch {}
  return "";
};

// const crypto = require("crypto");
// const { serverRuntimeConfig } = getConfig();
// export const encrypt = (text: string) => {
//   const publicKey = crypto.randomBytes(16);
//   let cipher = crypto.createCipheriv(
//     "aes-256-cbc",
//     Buffer.from(serverRuntimeConfig.privateKey, "hex"),
//     publicKey
//   );
//   let encrypted = cipher.update(text, "utf8", "hex");
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//   return `${encrypted.toString("hex")}.${publicKey.toString("hex")}`;
// };

// export const decrypt = (text: string) => {
//   try {
//     let [_text, publicKey] = text.split(".");
//     let encryptedText = Buffer.from(text, "hex");
//     let decipher = crypto.createDecipheriv(
//       "aes-256-cbc",
//       Buffer.from(serverRuntimeConfig.privateKey, "hex"),
//       Buffer.from(publicKey, "hex")
//     );
//     let decrypted = decipher.update(encryptedText, "hex", "utf8");
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted.toString();
//   } catch {}
//   return "";
// };
