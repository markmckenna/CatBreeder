import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const isWatch = process.argv.includes('--watch');
const shouldOpen = process.argv.includes('--open');

function openBrowser(url) {
  const platform = process.platform;
  const cmd = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${cmd} ${url}`);
}

const distDir = join(rootDir, 'dist');
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Copy HTML file to dist
copyFileSync(join(rootDir, 'public/index.html'), join(distDir, 'index.html'));

const buildOptions = {
  entryPoints: [join(rootDir, 'src/index.tsx')],
  bundle: true,
  outfile: join(distDir, 'bundle.js'),
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  sourcemap: true,
  minify: !isWatch,
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.css': 'css',
  },
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
  },
  logLevel: 'info',
};

async function build() {
  if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching for changes...');
    
    // Optional: serve the dist directory
    const { host, port } = await ctx.serve({
      servedir: distDir,
      port: 3000,
    });
    const url = `http://localhost:${port}`;
    console.log(`Server running at ${url}`);
    
    if (shouldOpen) {
      openBrowser(url);
    }
  } else {
    await esbuild.build(buildOptions);
    console.log('Build complete!');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
