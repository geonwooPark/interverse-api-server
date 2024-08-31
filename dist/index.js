"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
require("./db");
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const cors_1 = __importDefault(require("cors"));
const posting_router_1 = __importDefault(require("./routers/posting.router"));
const comment_router_1 = __importDefault(require("./routers/comment.router"));
const replyComment_router_1 = __importDefault(require("./routers/replyComment.router"));
const like_router_1 = __importDefault(require("./routers/like.router"));
const checklist_router_1 = __importDefault(require("./routers/checklist.router"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)({ origin: ["http://localhost:3000", "https://www.ventileco.site"] }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/posting", posting_router_1.default);
app.use("/comment", comment_router_1.default);
app.use("/reply-comment", replyComment_router_1.default);
app.use("/like", like_router_1.default);
app.use("/checklist", checklist_router_1.default);
app.use("/user", user_router_1.default);
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
    app.listen(process.env.PORT || 3000, () => {
        console.log("서버 실행중...");
    });
}
