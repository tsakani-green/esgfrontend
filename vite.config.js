import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react()],

    // DEV at "/", PROD can be "/esgfrontend/"
    base: isDev ? "/" : (process.env.VITE_BASE_PATH || "/esgfrontend/"),

    server: {
      port: 3002,
      proxy: {
        "/api": {
          target: process.env.VITE_PROXY_TARGET || "http://localhost:8003",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
