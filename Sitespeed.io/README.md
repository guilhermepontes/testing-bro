# Sitespeed.io

Weekly Dockerized performance + accessibility run against measurement.cint.com.
Logs in via Auth0, measures the studies list and a study report page, then sends
metrics to Graphite (for Grafana) and a summary to Slack.

## Files

- `login.js` — preScript, Auth0 login
- `measure.js` — measures `/studies` then a study report URL
- `run.sh` — runs sitespeed.io inside Docker

## Local usage

Requires Docker.

```bash
export MEASUREMENT_EMAIL=you@example.com
export MEASUREMENT_PASSWORD=your-password

# Optional: ship metrics / notify
export GRAPHITE_HOST=graphite.example.com
export GRAFANA_HOST=grafana.example.com
export GRAFANA_AUTH=your-grafana-api-token
export SLACK_HOOK_URL=https://hooks.slack.com/services/...

yarn sitespeed
```

HTML report is written to `sitespeed-result/` at the repo root.

## GitHub Actions

Workflow: `.github/workflows/sitespeed.yml`

- Runs every Monday at 09:00 UTC
- Can also be started manually (`workflow_dispatch`)
- Uploads each run’s HTML report as a unique workflow artifact (`sitespeed-result-<run_id>`, kept **14 days**)
- Deploys each run to `gh-pages` under `sitespeed/<run_id>/`

### GitHub Pages

1. In the repo: **Settings → Pages → Build and deployment → Source** → **Deploy from a branch**.
2. Branch: `gh-pages` / `/ (root)`.
3. After a successful run, the report is at:
   `https://<owner>.github.io/<repo>/sitespeed/<run_id>/`

The URL is also printed in the workflow logs.

### Required secrets

Secrets and vars live on the **`prd`** GitHub Environment (used by the `sitespeed` job).

| Secret | Purpose |
|--------|---------|
| `MEASUREMENT_EMAIL` | Auth0 login email |
| `MEASUREMENT_PASSWORD` | Auth0 login password |
| `GRAPHITE_HOST` | Graphite host Grafana reads from |
| `SLACK_HOOK_URL` | Slack incoming webhook URL |

### Optional secrets / vars

| Name | Type | Purpose |
|------|------|---------|
| `GRAPHITE_PORT` | secret | Default `2003` |
| `GRAPHITE_AUTH` | secret | `user:password` if Graphite needs auth |
| `GRAPHITE_NAMESPACE` | var | Default `sitespeed_io.im_ui` |
| `GRAFANA_HOST` | secret | Host for run annotations on dashboards |
| `GRAFANA_PORT` | secret | Default `80` |
| `GRAFANA_AUTH` | secret | Grafana API token (Bearer) |
| `SLACK_CHANNEL` | var | Channel name without `#` |

`GRAPHITE_HOST` must be reachable from GitHub-hosted runners (public
endpoint, tunnel, or switch the job to a self-hosted runner on your network).

### Grafana

1. Point a Grafana Graphite datasource at the same Graphite instance.
2. Import [sitespeed.io dashboards](https://www.sitespeed.io/documentation/sitespeed.io/graphite/)
   (namespace should be two parts + slug, e.g. `sitespeed_io.im_ui` + `im-ui`).
3. Optionally set `GRAFANA_HOST` / `GRAFANA_AUTH` so each run adds an annotation.

### Slack

Create an [Incoming Webhook](https://api.slack.com/messaging/webhooks) and store
the URL in `SLACK_HOOK_URL`. The run posts a summary (`--slack.type summary`).
