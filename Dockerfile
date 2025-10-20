# Stage 1: Build Angular app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build the Angular project in production mode
RUN npm run build -- --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built Angular app to Nginx html directory
COPY --from=builder /app/dist/orion-primefaces-ng /usr/share/nginx/html

# Copy custom Nginx config if you have one (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
