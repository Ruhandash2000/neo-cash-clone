import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  // Cloudflare Workers cannot resolve Node-style external packages at runtime.
  // Bundle metadata support with the SSR entry instead.
  ssr: {
    noExternal: ["reflect-metadata"],
  },
  server: {
    allowedHosts: true,
  },
});
