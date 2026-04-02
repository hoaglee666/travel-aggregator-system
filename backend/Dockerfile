# Use the official, lightweight Node.js 20 environment
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package files first (to cache dependencies and speed up future builds)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port your Express server runs on
EXPOSE 3000

# The command to start the server
CMD ["npm", "start"]