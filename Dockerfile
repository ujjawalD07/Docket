# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Expose a port (change to the port your Node.js application listens on)
EXPOSE 3000

# Define the command to start your Node.js application
CMD ["npm", "start"]
