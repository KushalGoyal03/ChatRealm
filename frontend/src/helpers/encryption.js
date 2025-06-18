/* eslint-disable no-unused-vars */
import CryptoJS from "crypto-js";

const SECRET_KEY = "ChatRealmKushalGoyal"; // Use .env in production

export function encrypt(text) {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8) || "[Decryption Failed]";
  } catch (err) {
    return "[Invalid Message]";
  }
}
