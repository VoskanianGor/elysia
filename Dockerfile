# FROM oven/bun

# WORKDIR /app

# COPY .xatarc .
# COPY package.json .
# COPY bun.lockb .
# COPY src src
# COPY tsconfig.json .

# RUN bun install --production

# ENV ENV production

# EXPOSE 8080

# CMD bun run src/index.ts

FROM debian:11.6-slim as builder

WORKDIR /app

RUN apt update
RUN apt install curl unzip -y

RUN curl https://bun.sh/install | bash

COPY package.json .
COPY bun.lockb .

RUN /root/.bun/bin/bun install --production

# ? -------------------------
FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=builder /root/.bun/bin/bun bun
COPY --from=builder /app/node_modules node_modules

COPY src src
# COPY public public
# COPY tsconfig.json .

ENV ENV production
CMD ["./bun", "src/index.ts"]

EXPOSE 8080