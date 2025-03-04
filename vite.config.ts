import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import Macros from "unplugin-macros/vite";

export default defineConfig({
  plugins: [
    Macros(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1048576,
      },
    }),
  ],
});