# Multi-stage build for Nuxt 3 landing page
FROM node:20 AS build

WORKDIR /app

# Copy package files
COPY package*.json package-lock.json* ./

# Install dependencies
RUN npm ci --omit=dev=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Copy built application (this is all we need!)
COPY --from=build /app/.output ./.output

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/bash -m nuxt

# Change ownership of the app directory
RUN chown -R nuxt:nodejs /app
USER nuxt

# Expose port 3000
EXPOSE 3000

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Start the application
CMD ["node", ".output/server/index.mjs"]