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

# Install Chromium browser and dependencies for browser automation
RUN apt-get update && apt-get install -y \
    chromium \
    libgbm1 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm-dev \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Install global node packages
RUN npm install -g npm@latest next typescript prisma puppeteer

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
ENV PUPPETEER_EXECUTABLE_PATH=/usr/lib/chromium/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Command to run when starting the container
CMD ["sleep", "infinity"]
