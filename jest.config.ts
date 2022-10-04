import * as React from "react";
import type { Config } from "jest";

export default {
  collectCoverageFrom: [
    "<rootDir>/src/**/!(*.spec|test)*.ts",
    "<rootDir>/src/**/!(*.spec|test)*.tsx",
  ],
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules"],
  transform: {
    "^.+\\.tsx?$": [
      "esbuild-jest",
      {
        sourcemap: "inline",
        target: ["esnext"],
        platform: "browser",
        format: "esm",
      },
    ],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testPathIgnorePatterns: ["node_modules"],
  passWithNoTests: true,
  testMatch: ["<rootDir>/src/**/*.@(spec|test).ts", "<rootDir>/src/**/*.@(spec|test).tsx"],
  globals: {
    React,
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
} as Config;
