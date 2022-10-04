import fs from "node:fs";
import path from "node:path";
import esbuild from "esbuild";

import type { Format, BuildOptions } from "esbuild";

const extensionPatterns = [
  // Standard .ts & .tsx files
  /^.+\.test\.tsx?$/gi,

  // Type definitions
  /^.+\.d\.ts$/gi,
];

const entryPoints = fs.readdirSync("src").reduce<string[]>((final, each) => {
  const ignore = extensionPatterns.map(p => p.test(each)).includes(true);
  if (!ignore) {
    final.push(path.resolve("src", each));
  }
  return final;
}, []);

async function build(format: Exclude<Format, "iife">): Promise<void> {
  const outdir = `dist/${format}`;
  const options: BuildOptions = {
    target: ["esnext"],
    format,
    platform: "browser",
    entryPoints,
    outdir,
    treeShaking: true,
    sourcemap: "inline",
  };
  const result = await esbuild.build(options);
  for (const error of result.errors) {
    console.error(error.text);
  }
  for (const warning of result.warnings) {
    console.warn(warning.text);
  }
  if (result.errors.length !== 0) {
    process.exit(1);
  }
  process.exit(0);
}

build("esm");
build("cjs");
