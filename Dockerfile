# Copied from https://github.com/BretFisher/node-docker-good-defaults/blob/master/Dockerfile

FROM node:8.16.1

# Create app directory
RUN mkdir -p /edx/app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT 18400

WORKDIR /edx/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm install --only=production
RUN npm install
ENV PATH /edx/app/node_modules/.bin:$PATH

COPY . /edx/app

ENTRYPOINT npm install && npm run start
