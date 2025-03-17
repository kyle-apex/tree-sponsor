FROM --platform=linux/arm64 node:20

# Install basic development tools
RUN apt-get update && apt-get install -y \
    git \
    procps \
    curl \
    wget \
    vim \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Install MySQL client for database operations
RUN apt-get update && apt-get install -y \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Install global node packages
RUN npm install -g npm@latest next typescript prisma

# Ensure correct permissions
RUN mkdir -p /home/node/.npm && chown -R node:node /home/node/.npm

# Add node user to sudoers
RUN echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node

# Create and set permissions for node_modules directory
RUN mkdir -p /workspace/node_modules && chown -R node:node /workspace

# Switch to non-root user
USER node

# Set environment variables
ENV NODE_ENV=development
ENV PATH=/workspace/node_modules/.bin:$PATH

# Command to run when starting the container
CMD ["sleep", "infinity"]
