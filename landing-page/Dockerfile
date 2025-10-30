# Multi-stage build for Nuxt 3 landing page
FROM node:20 AS build

WORKDIR /app

# Enable Corepack for Yarn
RUN corepack enable

# Copy package files
COPY package*.json yarn.lock* ./

# Install dependencies with clean cache
RUN yarn cache clean && \
    yarn install --frozen-lockfile --non-interactive

# Copy source code
COPY . .

# Build the application
RUN yarn build

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