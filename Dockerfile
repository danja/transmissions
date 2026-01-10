# Dockerfile
FROM node:20-alpine

# Install required system packages
RUN apk add --no-cache \
    bash \
    curl \
    python3 \
    make \
    g++

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy application files
COPY . .

# Create data directory for newsmonitor output
RUN mkdir -p /app/src/apps/newsmonitor/data

# Set environment
ENV NODE_ENV=production

# Expose HTTP port for serving generated HTML (configured in config/services.json)
EXPOSE 6010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:6010/ || exit 1

# Default command runs the scheduler
CMD ["node", "/app/docker/newsmonitor-scheduler.js"]
