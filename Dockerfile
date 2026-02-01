# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (VITE_API_URL will be read from environment variables)
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port (Render will assign PORT environment variable)
EXPOSE 5173

# Serve the app
# Render will set PORT environment variable, default to 5173
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:${PORT:-5173}"]
