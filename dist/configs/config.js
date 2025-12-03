"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.PORT) {
    throw new Error("PORT MISSING");
}
if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI MISSING");
}
if (!process.env.JWT_SECRET) {
    throw new Error("JWT-SECRET IS MISSING ");
}
if (!process.env.MY_EMAIL) {
    throw new Error("MY_EMAIL IS MISSING");
}
if (!process.env.MY_EMAIL_PASS) {
    throw new Error("My_EMAIL_PASS IS MISSING");
}
exports.config = {
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    myEmail: process.env.MY_EMAIL,
    myEmailPassword: process.env.MY_EMAIL_PASS
};
