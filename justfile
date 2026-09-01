set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

export PATH := home_dir() + "/.local/share/vite-plus/bin:" + env("PATH")

dev:
    vp dev

check:
    vp check
    vp test
    vp build

deploy: check
    vp exec wrangler deploy

db-migrate:
    vp exec wrangler d1 migrations apply freelance-desk --local

db-migrate-remote:
    vp exec wrangler d1 migrations apply freelance-desk --remote

db-seed: db-migrate
    mkdir -p seed
    vp exec node --experimental-strip-types scripts/build-seed.ts > seed/questions.sql
    vp exec wrangler d1 execute freelance-desk --local --file=seed/questions.sql

db-seed-remote: db-migrate-remote
    mkdir -p seed
    vp exec node --experimental-strip-types scripts/build-seed.ts > seed/questions.sql
    vp exec wrangler d1 execute freelance-desk --remote --file=seed/questions.sql

db-create:
    vp exec wrangler d1 create freelance-desk

cf-login:
    vp exec wrangler login

cf-whoami:
    vp exec wrangler whoami
