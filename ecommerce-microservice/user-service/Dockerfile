FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
COPY package*.json ./
RUN chmod +x ./entrypoint.sh
EXPOSE 3001
ENV SERVICE_NAME=user-service
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/src/main.js"]
