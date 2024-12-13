name: Publish Package

permissions:
  id-token: write
  contents: write

on:
  push:
    tags:
      - v*

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install pnpm
        uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          registry-url: https://registry.npmjs.org/
          cache: pnpm

      - run: pnpm install

      - run: npx changelogithub --no-group
        continue-on-error: true
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}

      - run: pnpm run publish:ci
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
          NPM_CONFIG_PROVENANCE: true
          NODE_OPTIONS: --max-old-space-size=6144