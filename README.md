# Monorepo Multitenant Platform Template

A template to create a monorepo SST ❍ Ion Multitenant Platform Template.

## Get started

1. Use this template to get up and running quickly for a multitenant platform set of applications.

2. Clone the new repo.

   ```bash
   git clone MY_APP
   cd MY_APP
   ```

3. Rename the files in the project to the name of your app.

   ```bash
   npx replace-in-file '/monorepo-template/g' MY_APP **/*.* --verbose
   ```

4. Deploy!

   ```bash
   npm install
   npx sst deploy
   ```

## Concepts

This project is designed so that there is a global platform concept which houses all the core components (users, organziations, user org membership, token vending machine to scope user and org specific credentials, etc..) in a central area. Below the global core is the concept of products which are product or applications for your platform. This concept is similar to how Office 365 is. Users and Orgs are global acorss all 365 products and a product is say Microsoft Word. All infra and source code for a product will go under `modules/products/<product name>`.

## Project Structure

### Core Platform

`modules/global-platform/infra` all infrastructure related code for the core platform \
`modules/global-platform/packages` all application related code for the core platform \
`modules/global-platform/packages/core` all application related code for the core platform that is agnostic to the cloud provider \
`modules/global-platform/packages/functions` all application related code for the core platform that is specific to the cloud provider. This will be your lambda handlers \

### Product Applications

`modules/<product>/infra` all infrastructure related code for the specific product application \
`modules/<product>/packages` all application related code for the specific product application

## Usage

This template uses [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces). It has 3 packages to start with and you can add more it.

1. `core/`

   This is for any shared code. It's defined as modules. For example, there's the `Example` module.

   `core/src/adapters` this is used for all adapters for specific resource level implmentations\
   `core/src/domain` this is where the domain level code which is agnostic to the cloud provider\
   `core/src/useCases` this is the orchestration between all the entities, repositories and business logic

2. `functions/`

   This is for your Lambda functions and it uses the `core` package as a local dependency.

3. `scripts/`

   This is for any scripts that you can run on your SST app using the `sst shell` CLI and [`tsx`](https://www.npmjs.com/package/tsx). For example, you can run the example script using:

   ```bash
   npm run shell src/example.ts
   ```

### Infrastructure

The `infra/` directory allows you to logically split the infrastructure of your app into separate files. This can be helpful as your app grows.

In the template, we have an `api.ts`, and `storage.ts`. These export the created resources. And are imported in the `sst.config.ts`.

---
