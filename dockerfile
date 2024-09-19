# Use a Node.js image as the base for both the server and the React app
FROM node:22-alpine3.19 AS build

# Create directories for the React app and the Node.js server
WORKDIR /app

# Copy React app code into the container
COPY ./app /app

# Install dependencies and build the React app
RUN npm install
RUN npm run build

# Second stage: Setup Node.js server
FROM node:22-alpine3.19

# Set working directory for the server
WORKDIR /server

# Copy the server code into the container
COPY ./server /server

# Copy the built React app from the previous stage
COPY --from=build /app/dist /server/public

# If you want to retain the /app directory in the second stage:
COPY --from=build /app /app

# Install server dependencies
RUN npm install

# # Expose the port the server will run on
# EXPOSE 3000

# Command to run the Node.js server
CMD ["node", "server.js"]
