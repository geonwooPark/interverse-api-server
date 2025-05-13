"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
require("./module-alias");
require("./db");
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = __importDefault(require("@routers/auth.router"));
const rooms_router_1 = __importDefault(require("@routers/rooms.router"));
const maps_router_1 = __importDefault(require("@routers/maps.router"));
const app = (0, express_1.default)();
const allowedOrigins = process.env.NODE_ENV === "production"
    ? ["https://yourdomain.com"]
    : ["http://localhost:5173"];
app.use((0, cors_1.default)({ origin: allowedOrigins }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/auth", auth_router_1.default);
app.use("/rooms", rooms_router_1.default);
app.use("/maps", maps_router_1.default);
if (process.env.NODE_ENV == "production") {
    const options = {
        ca: fs_1.default.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/fullchain.pem`),
        key: fs_1.default.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`),
        cert: fs_1.default.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/cert.pem`),
    };
    https_1.default.createServer(options, app).listen(process.env.PORT || 443, () => {
        console.log(`${process.env.PORT || 443}PORT 실행중..`);
    });
}
else {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`${process.env.PORT || 8000}PORT 실행중..`);
    });
}
