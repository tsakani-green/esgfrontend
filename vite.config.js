// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";

  return {
    plugins: [react()],
    base: isDev ? "/" : (env.VITE_BASE_PATH || "/"),

    server: {
      port: 3002,
      proxy: {
        "/api": {
          target: env.VITE_PROXY_TARGET || "http://localhost:8003",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
