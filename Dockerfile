# Docker multi-stage build

# base image
FROM node:12.2.0-alpine as build-stage

WORKDIR /app
COPY package*.json ./

MAINTAINER Agonaudid

# Just echo so we can see, if everything is there :)
RUN ls -l

# install and cache app dependencies
RUN npm install
RUN npm install @vue/cli@3.7.0 -g
COPY ./ .

# start app
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf