"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_alias_1 = require("module-alias");
const path_1 = __importDefault(require("path"));
const isProd = process.env.NODE_ENV === "production";
const baseDir = isProd ? path_1.default.resolve(__dirname, "..") : __dirname;
(0, module_alias_1.addAliases)({
    "@controllers": path_1.default.join(baseDir, "controllers"),
    "@db": path_1.default.join(baseDir, "db"),
    "@dto": path_1.default.join(baseDir, "dto"),
    "@errors": path_1.default.join(baseDir, "errors"),
    "@middlewares": path_1.default.join(baseDir, "middlewares"),
    "@models": path_1.default.join(baseDir, "models"),
    "@routers": path_1.default.join(baseDir, "routers"),
    "@utils": path_1.default.join(baseDir, "utils"),
});
