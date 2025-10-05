# Use Node.js 20 LTS slim image (same as frontend/Dockerfile)
# Matches the development stage to ensure consistency
FROM node:20-slim

# Install additional tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    curl \
    ca-certificates \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Set up workspace
WORKDIR /workspace

# Configure npm for better performance in container
RUN npm config set update-notifier false

# Create non-root user (node user already exists in the base image)
USER node

# Set default shell
SHELL ["/bin/bash", "-c"]
