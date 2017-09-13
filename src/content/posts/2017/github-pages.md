---
title: Deploy to Github Pages with custom domain + HTTPS
date: 2017-09-12
slug: Github Pages custom domain HTTPS
layout: post.html
---

This post explains howto:

- [Deploy to github pages](#deploy-to-github-pages)
- [Use a custom domain](#use-a-custom-domain)
- [Setup HTTPS using CloudFlare](#setup-https-using-cloudflare)

## Deploy to github pages

This `deploy.sh` script creates a gh-pages branch with all files in your `dist/` folder and pushes it to github.

```
# deploy.sh
git commit -am "Saved local changes"
# cp CNAME www/
git checkout -B gh-pages
git add -f dist
git commit -am "Deployed website"
git filter-branch -f --prune-empty --subdirectory-filter dist
git push -f origin gh-pages
git checkout -

```

The script should be executed after your build step. I added the following run task to my `package.json` file.

```
"scripts": {
	"deploy": "npm run build && bash deploy.sh",

```

After you run `npm run deploy` your page should be visible on `http://<username.github.io/<repository>`.

## Use a custom domain

If you want to use a custom domain add a `CNAME` file to your project. The `CNAME` file should contain your custom domain in the following format:

```
custom.domain.tld
```

Uncomment the `# cp CNAME www/` line in the deploy script and execute `npm run deploy`. Your gh-pages branch should now contain the `CNAME` file.

Add a *CNAME* record to point to *[username].github.io* to your *domain.tld* DNS provider.

Your custom domain should now be working.

## Setup HTTPS using CloudFlare

Unfortunately github pages does not support HTTPS for custom domains. This section explains how to get HTTPS working using CloudFlare.

Sign up for [CloudFlare](https://www.cloudflare.com) and create an account for your domain.

Follow the instructions on how to setup your domain. This includes changing your domains nameservers to CloudFlare.

You should have a CNAME pointing to [username].github.io in your CloudFlare DNS records. (follow steps previous section).

Go to the **Crypto** tab check if SSL status is **Active Certificate**. It can take up to 24 hours to become active.

When it is active you can enable the option **Always use HTTPS**.

HTTPS should now be enabled for your custom domain.



