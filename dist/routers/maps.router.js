"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userGuard_middleware_1 = require("@middlewares/userGuard.middleware");
const maps_controller_1 = require("@controllers/maps.controller");
const router = (0, express_1.Router)();
router.get("/", userGuard_middleware_1.userGuardMiddleware, maps_controller_1.getMaps);
router.post("/", userGuard_middleware_1.userGuardMiddleware, maps_controller_1.createMap);
exports.default = router;
