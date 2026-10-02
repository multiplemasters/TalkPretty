# TalkPretty — Communication Framework Guide

A field guide to 28 communication frameworks for conflict, feedback, interviews, persuasion, strategy, and everyday conversations. Find a framework, remember it with a cue, and take one useful next step.

Live site: https://multiplemasters.github.io/TalkPretty/

It's a plain Jekyll site. Every page is static HTML and readable without JavaScript; a small script (`assets/js/site.js`) adds search, category filters, saved favorites, dark mode, and copy-to-clipboard.

## Structure

| Path | What it is |
| --- | --- |
| `_frameworks/*.md` | One file per framework. All content lives in the front matter. |
| `_layouts/default.html` | Page shell: header, theme init, footer. |
| `_layouts/framework.html` | Framework detail page (steps, next move, example, prev/next). |
| `_includes/card.html` | Framework card on the home page, including its search text. |
| `index.html` | Home: hero, search, filters, framework grid. |
| `assets/css/site.css` | All styles, with light and dark themes. |
| `assets/js/site.js` | Progressive enhancement; state in `localStorage`. |
| `communication_frameworks_handbook.html` | Earlier standalone handbook (17 frameworks). Not published by the build. |

## Add or edit a framework

Copy any file in `_frameworks/`, rename it (the filename becomes the URL: `/frameworks/<name>/`), and edit the front matter. `order` controls position on the home page and in prev/next. `topics` must use the category names listed in `index.html` to appear under a filter.

## Run locally

Requires Ruby and Bundler.

```sh
bundle install
bundle exec jekyll serve      # http://localhost:4000/TalkPretty/
```

The `Gemfile` uses the `github-pages` gem so local builds match GitHub's.

## Deploy

`.github/workflows/jekyll-gh-pages.yml` builds the site with Jekyll and deploys it to GitHub Pages on every push to `main`. In the repo, **Settings → Pages → Source** must be set to **GitHub Actions**.
