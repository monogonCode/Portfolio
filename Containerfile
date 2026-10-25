# ==========================================
# Stage 1: Build static assets with Node.js
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy full source tree
COPY . .

# Build production static bundle
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Server
# ==========================================
FROM nginx:alpine

LABEL maintainer="Martín Alejandro Garbiso <martinalejandroo25@gmail.com>"
LABEL description="Retro OS Interactive Portfolio"

# Copy customized Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose container HTTP port
EXPOSE 80

# Health check verification
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:80/health || exit 1

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
