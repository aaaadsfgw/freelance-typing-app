import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";

const test = Boolean(process.env.VITEST);

export default {
  plugins: [react(), ...(test ? [] : [cloudflare()])],
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    ignorePatterns: [
      "ui-proposals/**",
      "docs/**",
      "seed/**",
      "dist/**",
      "scripts/**",
      "vite.config.ts",
      "src/**/*.test.ts",
    ],
  },
  fmt: {
    ignorePatterns: ["ui-proposals/**", "docs/**", "seed/**", "dist/**"],
  },
};
