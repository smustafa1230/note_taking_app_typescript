# Stage 1: Build the application
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./

COPY . ./
RUN rm -rf dist
# Build your application (adjust this command to match your project's build process)
RUN npm run build

# Stage 2: Create the production image
FROM node:18 AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/tsconfig*.json ./

# Install only production dependencies
RUN npm install 

# Copy the built application files
COPY --from=build /usr/src/app/dist ./dist
# COPY --from=build /usr/src/app/ ./
# RUN npm test
# RUN npx jest
# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]