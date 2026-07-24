# CI provider configs

Every provider runs the same Playwright suite against
`storedemo.testdino.com` and streams results live to TestDino via the
`@testdino/playwright` reporter (configured in `../playwright.config.js`).
There is **no post-run upload step** anywhere except the reference CircleCI Orb.

All configs are **sharded 4-way** and pass a shared `ciRunId` so the shards
group into a single logical run on the TestDino dashboard.

## Where each config lives

Some providers require their config at a fixed path (they will not run from
`ci/`), so those stay at the repo root. The rest live here for organization.

| Provider | Config | Sharding | Docs |
| --- | --- | --- | --- |
| GitHub Actions | `../.github/workflows/playwright.yml` | matrix `shardIndex` / `github.run_id` | [guide](https://docs.testdino.com/guides/playwright-github-actions) |
| GitLab CI/CD | `../.gitlab-ci.yml` | `CI_NODE_INDEX` / `CI_PIPELINE_ID` | [guide](https://docs.testdino.com/guides/playwright-gitlab-ci-setup) |
| Bitbucket Pipelines | `../bitbucket-pipelines.yml` | `BITBUCKET_PARALLEL_STEP` / `BITBUCKET_BUILD_NUMBER` | [guide](https://docs.testdino.com/guides/playwright-bitbucket) |
| CircleCI (CLI / streaming) | `../.circleci/config.yml` | `CIRCLE_NODE_INDEX` / `CIRCLE_WORKFLOW_ID` | [guide](https://docs.testdino.com/guides/playwright-circle-ci-cli) |
| Azure DevOps | `azure/azure-pipelines.yml` | `System.JobPositionInPhase` / `Build.BuildId` | [guide](https://docs.testdino.com/guides/playwright-azure-devops-pipeline) |
| AWS CodeBuild | `aws-codebuild/buildspec.yml` | batch `PW_SHARD` / commit sha | [guide](https://docs.testdino.com/guides/playwright-amazon-codebuild) |
| Jenkins | `jenkins/Jenkinsfile` | matrix `SHARD` / `BUILD_TAG` | [guide](https://docs.testdino.com/guides/playwright-jenkins) |
| CircleCI (Orb / upload) | `circleci/config-orb.yml` (reference) | none | [guide](https://docs.testdino.com/guides/playwright-circle-ci-orb) |
| TeamCity | `teamcity/README.md` (docs only) | manual | [guide](https://docs.testdino.com/guides/playwright-teamcity) |

## Required secrets/variables (per provider)

- `TESTDINO_TOKEN` — **required**, always store as a secret/masked variable.
- `TESTDINO_SERVER_URL` — hardcoded to `https://analytics.testdino.com` in each config.
- `STOREDEMO_USERNAME` / `STOREDEMO_PASSWORD` / `STOREDEMO_NEW_PASSWORD` — optional.
  Needed only for the `@ui` tests (login/cart/orders). The `@api` tests pass without them.

Non-secret values the UI tests need (profile + address like city/state/zip) are
committed in `../.env.ci` and loaded by `playwright.config.js`, so each provider
only has to supply the three secrets above.
