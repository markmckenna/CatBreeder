import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import cssModulesPlugin from 'esbuild-css-modules-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const isWatch = process.argv.includes('--watch');
const shouldOpen = process.argv.includes('--open');
const DEFAULT_PORT = 3000;

function openBrowser(url) {
  const platform = process.platform;
  const cmd = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${cmd} ${url}`);
}

/** Check if an existing dev server is responding on the port */
const isDevServerRunning = (port) =>
  fetch(`http://localhost:${port}/`)
    .then((res) => res.ok)
    .catch(() => false);

/** Try to start esbuild serve, incrementing port on EADDRINUSE */
async function serveWithFallback(ctx, servedir, startPort, maxAttempts = 100) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    try {
      const result = await ctx.serve({ servedir, port });
      if (port !== startPort) {
        console.log(`Port ${startPort} in use, using port ${port}`);
      }
      return { ...result, port };
    } catch (err) {
      if (err.message?.includes('EADDRINUSE') || err.code === 'EADDRINUSE') {
        continue;
      }
      throw err;
    }
  }
  throw new Error('No available ports found');
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
  plugins: [
    cssModulesPlugin({
      // Match .module.css OR styles.css in component folders
      filter: /(\.module\.css$|[\\/]styles\.css$)/,
    }),
  ],
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
    // Check if dev server is already running on default port
    if (await isDevServerRunning(DEFAULT_PORT)) {
      const url = `http://localhost:${DEFAULT_PORT}`;
      console.log(`Dev server already running at ${url}`);
      if (shouldOpen) {
        openBrowser(url);
      }
      console.log('Reconnected to existing server. Run "npm run dev:restart" to force restart.');
      return;
    }

    // Find available port (in case something else is using 3000)
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching for changes...');
    
    // Serve the dist directory, auto-incrementing port if needed
    const { port } = await serveWithFallback(ctx, distDir, DEFAULT_PORT);
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
