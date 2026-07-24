# playwright-ci-providers

A ready-to-clone repo for verifying TestDino's real-time streaming across every
documented CI provider. It runs a real Playwright suite against
[`storedemo.testdino.com`](https://storedemo.testdino.com) and streams results
live to TestDino using the [`@testdino/playwright`](https://www.npmjs.com/package/@testdino/playwright)
reporter. Pick your provider, set a token, run.

## What's inside

- **50 tests** against storedemo + a public API:
  - **29 `@api` tests** — no credentials needed (default `https://dummyjson.com`).
  - **21 UI tests** (`@chromium` / `@firefox` / `@webkit` / `@ios`) — need storedemo
    credentials; without them they fail but still stream.
- **Page Object Model** under `pages/`.
- **8 CI providers**, each sharded 4-way and grouped into one TestDino run.

## Streaming, not uploading

The `@testdino/playwright` reporter (in `playwright.config.js`) streams results
live during the run and uploads artifacts itself. There is **no separate upload
step**. Grouping sharded runs works by passing the same `ciRunId` (each provider
maps it to its own run/pipeline id).

## Quick start (local)

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env        # fill in TESTDINO_TOKEN (+ storedemo creds for UI tests)

export TESTDINO_TOKEN=your_token
export TESTDINO_SERVER_URL=https://analytics.testdino.com
npm test                    # or: npm run test:api  (green with no credentials)
```

## CI providers

Configs for providers that require a fixed path live at the repo root; the rest
are under `ci/`. Full mapping, sharding variables, and required secrets:
**[ci/README.md](ci/README.md)**.

| Provider | Location | Auto-runs from this repo |
| --- | --- | --- |
| GitHub Actions | `.github/workflows/playwright.yml` | ✅ on GitHub |
| GitLab CI/CD | `.gitlab-ci.yml` | ✅ on GitLab |
| Bitbucket Pipelines | `bitbucket-pipelines.yml` | ✅ on Bitbucket |
| CircleCI (streaming) | `.circleci/config.yml` | ✅ on CircleCI |
| Azure DevOps | `ci/azure/azure-pipelines.yml` | point pipeline at the file |
| AWS CodeBuild | `ci/aws-codebuild/buildspec.yml` | point project at the file (batch) |
| Jenkins | `ci/jenkins/Jenkinsfile` | point job at the file |
| TeamCity | `ci/teamcity/README.md` | documented (manual) |

## Required secrets

| Variable | Required | Used for |
| --- | --- | --- |
| `TESTDINO_TOKEN` | yes | streaming to TestDino (store as a secret) |
| `TESTDINO_SERVER_URL` | preset | `https://analytics.testdino.com` (hardcoded in configs) |
| `STOREDEMO_USERNAME` / `STOREDEMO_PASSWORD` | optional | the 21 UI tests only |

## Notes

- **Server URL:** this repo targets the `analytics.testdino.com` instance. Public
  TestDino uses `api.testdino.com` (the reporter default) — override
  `TESTDINO_SERVER_URL` if you point elsewhere.
- **Visual tests** from the source suite are intentionally excluded (cross-CI
  rendering diffs make them flaky in a "runs everywhere" showcase).
- Source tests adapted from
  [testdino-hq/playwright-sample-tests-javascript](https://github.com/testdino-hq/playwright-sample-tests-javascript).
