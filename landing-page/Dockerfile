# Multi-stage build for Nuxt 3 landing page
FROM node:18 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean cache
RUN npm cache clean --force && \
    npm install --no-optional --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18 AS production

WORKDIR /app

# Copy built application
COPY --from=build /app/.output ./.output

# Copy package files for runtime dependencies
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install  && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nuxt -u 1001

# Change ownership of the app directory
RUN chown -R nuxt:nodejs /app
USER nuxt

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]