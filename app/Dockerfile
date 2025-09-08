FROM alpine:3.22
WORKDIR /app

RUN apk add --no-cache nodejs pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm i

COPY main.js index.html ./

EXPOSE 80
CMD ["node", "main.js"]
