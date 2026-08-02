FROM node:22-alpine

WORKDIR /app

# Workspace install (term-core + ssh service)
COPY package.json yarn.lock ./
COPY packages/term-core/package.json ./packages/term-core/
COPY services/ssh/package.json ./services/ssh/
RUN yarn install --production --frozen-lockfile

COPY packages/term-core ./packages/term-core
COPY services/ssh ./services/ssh

WORKDIR /app/services/ssh

ENV NODE_ENV=production
ENV PORT=22

EXPOSE 22

# Port 22 requires privileged bind; run as root in the container.
CMD ["node", "src/index.js"]
