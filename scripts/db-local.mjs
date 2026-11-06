// Starts the Docker database and applies migrations to it: `bun run db:local`.
//
// .env holds the real Supabase URLs. Setting both variables here is what keeps
// this script local: real environment variables win over .env files.
import { spawnSync } from 'node:child_process';

const LOCAL_URL = 'postgres://postgres:postgres@127.0.0.1:5433/portfolio';

function run(command, args, env = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: { ...process.env, ...env } });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

const started = run('docker', ['compose', 'up', '--detach', '--wait']);
if (started !== 0) {
  console.error('\nCould not start the database. Is Docker Desktop running?');
  process.exit(started);
}

const migrated = run('bun', ['x', 'drizzle-kit', 'migrate'], {
  DATABASE_URL: LOCAL_URL,
  DATABASE_MIGRATION_URL: LOCAL_URL,
});
if (migrated !== 0) process.exit(migrated);

console.log(`\nLocal database ready: ${LOCAL_URL}`);
