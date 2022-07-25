# Hydrogen Store with Algolia React InstantSearch Hooks

This is a demo store using Shopify Hydrogen and Algolia React InstantSearch Hooks.

The two entry points for search are:

- [`/src/routes/search.server.tsx`](/src/routes/search.server.tsx)
- [`/src/components/search/SearchPage.client.tsx`](/src/components/search/SearchPage.client.tsx)

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts.

[Check out the docs](https://shopify.dev/custom-storefronts/hydrogen)

## Getting started

**Requirements:**

- Node.js version 16.5.0 or higher
- Yarn

To create a new Hydrogen app, run:

```bash
npm init @shopify/hydrogen
```

## Running the dev server

Then `cd` into the new directory and run:

```bash
npm install
npm run dev
```

Remember to update `hydrogen.config.js` with your shop's domain and Storefront API token!

## Building for production

```bash
npm run build
```

## Previewing a production build

To run a local preview of your Hydrogen app in an environment similar to Oxygen, build your Hydrogen app and then run `npm run preview`:

```bash
npm run build
npm run preview
```
