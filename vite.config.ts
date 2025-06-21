import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Make sure it's reachable on all network interfaces
    port: 8080, // Customize the port as per your preference
    open: true, // Optionally, automatically open the app in your browser
  },
  plugins: [
    react(), // React plugin for SWC (fast compilation)
    // Add more plugins if necessary
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Aliases for easier imports
    },
  },
  build: {
    minify: mode === "production", // Minify only in production mode
    sourcemap: mode === "development", // Enable sourcemaps in dev for debugging
  },
  optimizeDeps: {
    // You can tweak dependency optimization settings here for faster builds
    include: ["some-package"],
  },
}));
