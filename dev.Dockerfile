# Stage: Development
FROM node:18

WORKDIR /usr/src/app

# Copy package files first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Install nodemon globally for live reload
RUN npm install -g nodemon

# Expose the backend port
EXPOSE 3000

# Start the server with nodemon
CMD ["nodemon", "--legacy-watch", "index.js"]
