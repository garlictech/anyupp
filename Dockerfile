FROM node:14-alpine


RUN apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --upgrade pip \
    && pip3 install \
        awscli \
    && rm -rf /var/cache/apk/*

RUN aws --version

RUN npm install --global @aws-amplify/cli cowsay

COPY ./tools/setup-aws-environment.sh /setup-aws-environment.sh
RUN /setup-aws-environment.sh
