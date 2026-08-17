# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npx prisma generate --schema=prisma/schema.local.dev
RUN npm run build
RUN npx tsc prisma/seed.ts --outDir dist/prisma --module commonjs --target es2021 --esModuleInterop

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --omit=dev
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npx prisma generate --schema=prisma/schema.local.dev
COPY --from=builder /app/dist ./dist
EXPOSE 4003
CMD ["sh", "-c", "npx prisma db push --schema=prisma/schema.prisma --accept-data-loss && npm run start"]

