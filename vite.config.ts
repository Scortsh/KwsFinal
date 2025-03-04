import { defineConfig } from "vite";

export default defineConfig({
    base: "./KwsFinal",
    server: {
        proxy: {
            "./KwsFinal": "http://localhost:3000",
        },
    },
});