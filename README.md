### Website

Source code for [wllnr.nl](https://www.wllnr.nl) — static site plus a shared fake terminal (browser + SSH).

## Development

```bash
yarn install
yarn start          # site on http://localhost:3000
yarn start:ssh      # fake SSH on port 22 (needs privileges) or PORT=2222 yarn start:ssh
```

Local SSH without privileged bind:

```bash
PORT=2222 yarn start:ssh
ssh -p 2222 -o PreferredAuthentications=password -o PubkeyAuthentication=no guest@localhost
# any password (including empty) works — this is not a real shell
```

Docker (SSH image):

```bash
docker build -f services/ssh/Dockerfile -t wllnr-term .
docker run --rm -p 2222:22 wllnr-term
ssh -p 2222 -o PreferredAuthentications=password -o PubkeyAuthentication=no guest@localhost
```

The browser terminal and SSH server share `@wllnr/term-core`. There is no host shell access.

## Deploy

Publish a release tag to build and push versioned images to GHCR. Flux on the `beast` cluster watches those tags and updates Deployments.

```bash
git tag v1.0.2
git push origin v1.0.2
# optional:
# gh release create v1.0.2 --generate-notes
```

CI runs for tags matching `v*` and publishes:

- `ghcr.io/jwellner/website/website:<tag>` — nginx static site
- `ghcr.io/jwellner/website/term:<tag>` — fake SSH server (TCP/22)

### Cluster notes (Flux)

Expose the term Deployment/Service on TCP/22 (LoadBalancer, MetalLB, or ingress-nginx TCP passthrough). Point `wllnr.nl` or `ssh.wllnr.nl` at that address. Mount a stable host key via `HOST_KEY_PATH` (Secret) so clients do not see changing host-key warnings.
