"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshTokenVersion = getRefreshTokenVersion;
exports.incrementRefreshTokenVersion = incrementRefreshTokenVersion;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
const FILE_PATH = (0, path_1.join)(__dirname, './refresh-token-version.json');
let cache = null;
function loadRefreshTokenVersions() {
    if (cache)
        return cache;
    if (!(0, fs_1.existsSync)(FILE_PATH))
        return {};
    const raw = (0, fs_1.readFileSync)(FILE_PATH, 'utf-8');
    cache = JSON.parse(raw);
    return cache;
}
function getRefreshTokenVersion(userId) {
    const store = loadRefreshTokenVersions();
    return store[userId] ?? (0, crypto_1.randomUUID)();
}
function incrementRefreshTokenVersion(userId) {
    const store = loadRefreshTokenVersions();
    const updated = (0, crypto_1.randomUUID)();
    store[userId] = updated;
    cache = store;
    (0, fs_1.writeFileSync)(FILE_PATH, JSON.stringify(store, null, 2));
    return updated;
}
//# sourceMappingURL=refresh-token-version.store.js.map