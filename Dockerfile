# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Copy TypeScript configuration
COPY tsconfig.json ./

# Install ALL dependencies (including devDependencies for TypeScript compilation)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Remove devDependencies to reduce image size (optional but recommended)
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 5003

# Command to run the compiled application
CMD ["node", "dist/server.js"]