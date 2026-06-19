import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
    nitro(),
  ],
  server: {
    port: 8082,
    warmup: {
      clientFiles: [
        "./src/routeTree.gen.ts",
        "./src/router.tsx",
        "./src/start.ts",
      ],
    },
  },
  optimizeDeps: {
    // Pre-bundle all heavy deps so Vite doesn't re-discover them on every
    // HMR cycle.
    include: [
      // React core
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      // TanStack
      "@tanstack/react-router",
      "@tanstack/react-query",
      "@tanstack/react-start",
      // Supabase
      "@supabase/supabase-js",
      // Radix UI primitives (all used by shadcn)
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      // Icon library — biggest barrel culprit for HMR slowness
      "lucide-react",
      // Other heavy deps
      "axios",
      "zustand",
      "react-hot-toast",
      "recharts",
      "date-fns",
      "zod",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
      "sonner",
      "react-hook-form",
      "@hookform/resolvers/zod",
      "embla-carousel-react",
      "cmdk",
      "vaul",
      "input-otp",
      "react-resizable-panels",
      "react-day-picker",
    ],
  },
});
