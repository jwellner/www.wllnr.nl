### Website

Source code for my website

## Development

Install dependencies 
```
yarn install
```

Start dev server
```
yarn start
```

## Deploy

Publish a release tag to build and push a versioned image to GHCR. Flux on the `beast` cluster watches those tags and updates the Deployment.

```bash
git tag v1.0.0
git push origin v1.0.0
# optional:
# gh release create v1.0.0 --generate-notes
```

CI only runs for tags matching `v*` (for example `v1.0.1`). Image: `ghcr.io/jwellner/website/website:<tag>`.
