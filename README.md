# Shopify Tailwind Starter Theme

A minimal **Shopify Online Store 2.0** theme where **Tailwind CSS v4 is the only stylesheet**. There is no Dawn `base.css`, no vendor CSS — every style comes from Tailwind utility classes compiled into a single `assets/application.css`.

## How it works

```
assets/tailwind.css   →  tailwindcss CLI  →  assets/application.css  →  layout/theme.liquid
   (you edit)            (build step)         (committed, auto-built)    (loads it)
```

- Both the source and the compiled output live in `assets/` to stay within Shopify's standard folder structure (no non-standard top-level `src/` folder).
- You write utility classes directly in `.liquid` files.
- The Tailwind CLI scans those files (see the `@source` lines in `assets/tailwind.css`) and outputs only the classes you actually use.
- `layout/theme.liquid` loads the compiled file with `{{ 'application.css' | asset_url | stylesheet_tag }}`.
- Shopify uploads `assets/tailwind.css` to its CDN too, but no page ever references it — only `application.css` is loaded.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli/install) (`shopify` on your PATH)
- A Shopify store (a free [development store](https://shopify.dev/docs/api/development-stores) works)

## Getting started

```bash
# 1. Install build tooling
npm install

# 2. Run Tailwind watch + Shopify dev server together (live reload)
npm run dev
```

`npm run dev` runs two processes concurrently:

- `tw:watch` — recompiles `assets/application.css` whenever a `.liquid` file changes.
- `shopify:dev` — starts `shopify theme dev`, which uploads the theme to your store and serves a live-reloading preview.

The first time you run it, the Shopify CLI will prompt you to log in and pick a store.

## Deploying (Shopify GitHub integration)

This theme deploys through Shopify's **GitHub integration** (Online Store → Themes → Add from GitHub). Shopify serves the repo files directly and has **no build step**, so the compiled `assets/application.css` must be committed to the repo.

You don't build it by hand. The **`Build Tailwind CSS` GitHub Action** ([.github/workflows/build-css.yml](.github/workflows/build-css.yml)) handles it:

1. You edit `.liquid` files and/or `assets/tailwind.css` and push to `main`.
2. The Action rebuilds `assets/application.css` and commits it back to `main`.
3. Shopify's GitHub integration syncs the new commit to your store.

So the normal contributor flow is just: **edit → commit source → push**. The compiled CSS stays in sync automatically.

> Editing `assets/application.css` by hand is pointless — the Action overwrites it on the next push.

### Deploying manually instead (optional)

If you prefer to push from your machine with the Shopify CLI, build first so the compiled file is current:

```bash
npm run build          # minified assets/application.css
shopify theme push     # upload the theme to your store
```

## Project structure

| Path | Purpose |
| --- | --- |
| `assets/tailwind.css` | Tailwind source + design tokens (`@theme`). The only file you edit for global styles. |
| `assets/application.css` | Compiled output. Committed and auto-rebuilt by CI — don't edit by hand. |
| `layout/theme.liquid` | Root layout. Loads the compiled CSS. |
| `sections/` | Section files, including `header-group.json` / `footer-group.json` and all `main-*` sections. |
| `snippets/` | Reusable partials (`product-card`, `price`). |
| `templates/*.json` | OS 2.0 templates that wire sections to pages. |
| `config/` | Theme settings schema + data. |
| `locales/` | Translated strings. |

## Customizing the design

Edit the design tokens in `assets/tailwind.css`:

```css
@theme {
  --color-brand: oklch(0.55 0.2 264);   /* used as bg-brand, text-brand, etc. */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

Tailwind automatically generates matching utilities. Use `bg-brand`, `text-brand`, `hover:bg-brand-dark`, `font-sans`, and the full Tailwind utility set everywhere in markup.

## Notes

- This is a deliberately small starter: core templates (home, product, collection, list-collections, page, cart, search, 404) plus a few home-page sections. Add more sections/blocks as your store grows.
- To add the Tailwind Typography plugin for rich-text areas, install `@tailwindcss/typography` and add `@plugin "@tailwindcss/typography";` to `assets/tailwind.css`, then use `prose` classes.
