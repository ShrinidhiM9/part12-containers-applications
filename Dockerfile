# Stage 0: Run tests
FROM node:20


WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Run tests (will fail the build if any test fails)
RUN npm run test -- --watchAll=false --ci

# Stage 1: Build frontend
FROM node:18 AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Set backend URL environment variable for Vite
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Build the frontend
RUN npm run build

# Stage 2: Serve frontend with nginx
FROM nginx:alpine

# Copy built files from previous stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
