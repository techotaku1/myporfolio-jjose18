import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dotenvCli = path.resolve(root, 'node_modules/dotenv-cli/cli.js');
const drizzleBin = path.resolve(root, 'node_modules/drizzle-kit/bin.cjs');

const result = spawnSync(
  process.execPath,
  [dotenvCli, '-c', '--', process.execPath, drizzleBin, 'migrate'],
  { stdio: 'inherit', cwd: root },
);

process.exit(result.status ?? 1);
