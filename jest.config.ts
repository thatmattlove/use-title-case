import type { Config } from "jest";

export default {
  collectCoverageFrom: [
    "<rootDir>/src/**/!(*.spec|test)*.ts",
    "<rootDir>/src/**/!(*.spec|test)*.tsx",
  ],
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules"],
  transform: {
    "^.+\\.tsx?$": ["esbuild-jest", { sourcemap: "inline" }],
  },
  testPathIgnorePatterns: ["node_modules"],
  passWithNoTests: true,
  testMatch: ["<rootDir>/src/**/*.@(spec|test).ts", "<rootDir>/src/**/*.@(spec|test).tsx"],
} as Config;
