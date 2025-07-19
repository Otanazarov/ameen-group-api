"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = randomString;
function randomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
//# sourceMappingURL=random-string.util.js.map