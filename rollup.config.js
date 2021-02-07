import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const name = 'UseTitleCase';

const plugins = [
  external(),
  resolve({ extensions }),
  typescript({ sourceMap: true, importHelpers: true }),
  commonjs(),
  babel({
    extensions,
    babelHelpers: 'bundled',
    include: ['src/**/*'],
  }),
];

const input = './src/index.ts';

export default [
  {
    input,
    output: {
      name,
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },

    plugins,
  },
  {
    input,
    output: {
      name,
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },

    plugins,
  },
];
