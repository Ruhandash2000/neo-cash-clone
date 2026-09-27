import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
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
