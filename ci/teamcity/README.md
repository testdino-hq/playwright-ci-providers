# TeamCity (documented, not yet automated)

Docs: https://docs.testdino.com/guides/playwright-teamcity

TeamCity has no portable config file that ships in the repo the way the other
providers do (it is configured through the UI or a versioned Kotlin DSL under
`.teamcity/settings.kts`). For v1 this provider is **documented only** and runs
**unsharded**. A Kotlin DSL + sharded build chain is a planned follow-up.

## Manual setup (UI)

1. **Create a Build Configuration** attached to this repo (VCS root).
2. **Parameters** (Environment variables), mark the token as a password/secret:
   - `env.TESTDINO_TOKEN` = your TestDino token
   - `env.TESTDINO_SERVER_URL` = `https://analytics.testdino.com`
   - `env.USERNAME` = storedemo login (optional, for `@ui` tests)
   - `env.PASSWORD` = storedemo password (optional, for `@ui` tests)
3. **Build Steps** — add a single Command Line step:
   ```bash
   npm ci
   npx playwright install --with-deps
   npx playwright test || true
   ```
   Results stream live to TestDino via the `@testdino/playwright` reporter in
   `playwright.config.js`. No upload step.

## Sharding (optional, manual)

TeamCity has no built-in Playwright shard index. To shard, create a matrix /
parameterized build (one build per shard) and pass a **shared** run id so shards
group into one TestDino run. Use the TeamCity build chain id, for example:

```bash
export TESTDINO_CI_RUN_ID="%teamcity.build.id%"   # same across the chain
npx playwright test --shard=%shard.index%/%shard.total% || true
```

Set `shard.index` (1-based) and `shard.total` per build configuration.
