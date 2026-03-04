import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This is the Vite configuration for building the library.
// It specifies the entry point, output formats, and external dependencies to ensure that React and PuckEditorCore are not bundled with the library,
// allowing users to manage their own versions of these dependencies. The configuration also preserves the dist/types directory by setting emptyOutDir to false.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    emptyOutDir: false, // ✅ non cancellare dist (preserva dist/types)
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "PuckPluginImportExport",
      fileName: (format) =>
        `puck-plugin-import-export.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom", "@puckeditor/core"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@puckeditor/core": "PuckEditorCore",
        },
      },
    },
  },
});
