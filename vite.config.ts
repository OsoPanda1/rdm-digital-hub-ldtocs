import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Vite config robusto para Real del Monte Explorer / Hub
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Evita errores en librerías que esperan process.env en runtime de browser.
  define: {
    "process.env": {},
  },

  build: {
    // Esbuild suele ser más rápido que Terser para la mayoría de casos. [web:124]
    minify: "esbuild",
    // Si no necesitas sourcemaps en producción, desactivarlos acelera el build. [web:124]
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // Sólo nos interesa dividir dependencias externas.
          if (!id.includes("node_modules")) return;

          // Framer Motion separado: animaciones pesadas pero muy cacheables. [web:122]
          if (id.includes("node_modules/framer-motion")) {
            return "framer-vendor";
          }

          // Leaflet y geospatial stack separado. [web:122][web:127]
          if (
            id.includes("node_modules/leaflet") ||
            id.includes("node_modules/react-leaflet") ||
            id.includes("node_modules/supercluster")
          ) {
            return "leaflet-vendor";
          }

          // React core en un vendor propio. [web:118][web:122]
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router")
          ) {
            return "react-vendor";
          }

          // Radix UI separado (componentes con mucho peso en JS/CSS). [web:122]
          if (id.includes("node_modules/@radix-ui")) {
            return "radix-vendor";
          }

          // Fallback: resto de node_modules a un chunk genérico.
          return "vendor";
        },
      },
    },
  },
});
