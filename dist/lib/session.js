"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("./sessions/jwt");
const cookies_1 = require("./sessions/cookies");
exports.default = {
    JWT: jwt_1.JWT,
    Cookie: cookies_1.Cookie
};
