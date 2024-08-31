"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const like_controller_1 = require("../controllers/like.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/:parentId", like_controller_1.getLikeUsers);
router.patch("/:parentId", auth_middleware_1.authMiddleware, like_controller_1.toggleLike);
exports.default = router;
