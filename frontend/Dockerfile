# Multi-stage Dockerfile for React + Vite frontend
# Note: There's a known npm issue in Docker (https://github.com/npm/cli/issues/4769)
# that causes "Exit handler never called!" errors. This is benign and doesn't affect
# the development container functionality. For production builds, consider using
# node:20 (full) instead of node:20-slim if issues persist.

# Stage 1: Development
FROM node:20-slim AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server with host exposure for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage 2: Build (for production)
FROM node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production
FROM nginx:alpine AS production

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
