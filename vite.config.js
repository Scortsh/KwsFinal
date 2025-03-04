"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
exports.default = (0, vite_1.defineConfig)({
    base: "./KwsFinal",
    server: {
        proxy: {
            "./KwsFinal": "http://localhost:3000",
        },
    },
});
