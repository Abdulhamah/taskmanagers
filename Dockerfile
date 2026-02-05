FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend ./frontend
COPY backend ./backend

RUN npm ci
RUN npm run build --workspace=frontend
RUN npm run build --workspace=backend

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/node_modules ./backend/node_modules

EXPOSE 3001

CMD ["node", "backend/dist/index.js"]
