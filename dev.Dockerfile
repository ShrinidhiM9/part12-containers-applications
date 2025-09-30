# Stage: Development
FROM node:18

WORKDIR /usr/src/app

# Copy package files first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose Vite development server port
EXPOSE 5173

# Use VITE_BACKEND_URL from docker-compose
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Start the Vite development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
