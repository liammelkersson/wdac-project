# Pull a image with node already integrated
FROM node:20-alpine
# Define a directory to use inside the container
WORKDIR /usr/src/app
# Copy the content of our working directory into
# the container's working directory
COPY . .
# Install necessary requirements
RUN npm install
# Expose port 3000 for the web server
EXPOSE 3000
# Define the command for starting our web application
# inside the container (often app.js)
CMD [ "node", "server.js"]

# DATABASE
FROM postgres:latest
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD 12345
ENV POSTGRES_DB postgres
EXPOSE 5432
