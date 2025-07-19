"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const CryptoJS = require("crypto-js");
const config_1 = require("../../config");
function encrypt(text) {
    const ciphertext = CryptoJS.AES.encrypt(text.toString(), config_1.env.PASSPHRASE);
    const ciphertextString = ciphertext.toString();
    return ciphertextString;
}
function decrypt(text) {
    const decrypted = CryptoJS.AES.decrypt(text.toString(), config_1.env.PASSPHRASE);
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    return plaintext;
}
//# sourceMappingURL=hashing.utils.js.map