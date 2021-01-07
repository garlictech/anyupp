# ---- Base Node ----
FROM node:12-alpine AS base
LABEL maintainer="Cyberg"
RUN apk --no-cache update \
  && apk --no-cache  add --virtual builds-deps build-base python \
  && mkdir -p /usr/src/app \
  && yarn global add nodemon
WORKDIR /usr/src/app

# copy project file
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
COPY decorate-angular-cli.js /usr/src/app

#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN yarn --production  --frozen-lockfile
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
COPY . .

RUN yarn && yarn nx build graphql-server

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules
COPY --from=dependencies /usr/src/app/dist ./dist
RUN mkdir -p /usr/src/libs/graphql/schema/src/
COPY ./libs/graphql/schema/src/schema /usr/src/app/libs/graphql/schema/src/schema
ENV NODE_ENV production
EXPOSE 3333
CMD ls -l /usr/src/app \
  && ls -l /usr/src/app/libs/graphql\
  && ls -l /usr/src/app/libs/graphql/schema \
  && ls -l /usr/src/app/libs/graphql/schema/src/\ 
  && ls -l /usr/src/app/libs/graphql/schema/src/schema \
  && nodemon ./dist/apps/graphql-server/main.js

