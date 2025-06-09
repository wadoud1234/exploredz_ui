import { defineConfig } from "vite";
// import viteReact from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
// import { chunkSplitPlugin } from "vite-plugin-chunk-split";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    // chunkSplitPlugin({ strategy: "unbundle" }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
  },

  build: {
    target: "esnext", // Target modern JavaScript only,
    sourcemap: false, // Disable sourcemaps in production
    minify: "esbuild", // Enable esbuild for minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs for production
      },
    },
    cacheDir: ".vite", // Make sure the cache is stored in a persistent location,
  },
  // optimizeDeps: {
  //   include: [
  //     // 'react',
  //     // 'react-dom',
  //     '@tanstack/react-router',
  //     '@tanstack/react-table',
  //     // 'recharts',
  //     // 'zod',
  //     // 'clsx',
  //     // 'tailwind-merge',
  //     '@tabler/icons-react',
  //     'lucide-react'
  //   ],
  //   exclude: [
  //     '@tanstack/router-plugin', // Dev-only plugin
  //     '@tanstack/react-router-devtools', // Dev-only
  //     // '@tabler/icons-react', // Large icon library
  //     // 'lucide-react' // Another icon library
  //   ],
  // },
  // server: {
  //   watch: {
  //     ignored: [
  //       '**/node_modules/**',
  //       '**/.git/**',
  //       '**/dist/**',
  //       '**/test-results/**'
  //     ]
  //   }
  // },
  // build: {
  //   minify: 'esbuild',
  //   target: 'esnext'
  // }
});
