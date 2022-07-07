#!/bin/bash

echo "Remove node_modules & package-lock.json"
rm -r -f -d ./dist ./node_modules ./package-lock.json

echo "Install dependencies..."
npm install --save --save-exact \
    @nestjs/common@latest \
    @nestjs/microservices@latest \
    @nestjs/platform-express@latest \
    @nestjs/core@latest \
    @wspro/config@latest \
    @wspro/ets-client@latest \
    kafkajs@latest \
    knex@latest \
    pg@latest

echo "Install dev dependencies..."
npm install --save-dev --save-exact \
    @nestjs/cli@latest \
    @types/node@latest \
    @types/pg@latest \
    cross-env@latest \
    rimraf@latest \
    ts-loader@latest \
    ts-node@latest \
    tsconfig-paths@latest \
    typescript@latest

echo "Install linter dependencies..."
npm install --save-dev --save-exact \
    @wspro/linter@latest \
    @typescript-eslint/eslint-plugin@latest \
    @typescript-eslint/parser@latest \
    eslint@latest \
    eslint-config-airbnb-base@latest \
    eslint-config-airbnb-typescript@latest \
    eslint-config-prettier@latest \
    eslint-plugin-import@latest \
    eslint-plugin-jest@latest \
    eslint-plugin-jsx-a11y@latest \
    eslint-plugin-prettier@latest \
    eslint-plugin-simple-import-sort@latest \
    husky@latest \
    lint-staged@latest \
    prettier@latest

echo "Installed all dependencies"
