import { defineConfig } from "vite";

export default defineConfig({
    base: "./KwsFinal",
    server: {
        proxy: {
            "./KwsFinal/api": "http://localhost:3000",
        },
    },
});