FROM node:20 AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN ./node_modules/.bin/prisma generate
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

RUN mkdir -p /app/uploads

EXPOSE 3001
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --accept-data-loss && node dist/main"]
