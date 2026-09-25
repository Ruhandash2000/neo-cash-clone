/**
 * Vite & TanStack Start Application Configuration
 * Configures server entries, TypeScript paths, and build pipeline settings.
 */
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  tanstackStart: {
    // Configures server entry point for Server-Side Rendering (SSR) and Nitro bundler
    server: { entry: "server" },
  },
});
