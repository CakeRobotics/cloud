FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive

# Install basic dependencies
RUN apt-get update && \
    apt-get install -y python3-pip wget

# Install node
WORKDIR /root
RUN wget https://deb.nodesource.com/setup_16.x && \
    bash setup_16.x && \
    apt install nodejs
RUN npm install -g yarn

# Install oc
WORKDIR /root
RUN wget -q https://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.8.13/openshift-client-linux.tar.gz && \
    tar xzf openshift-client-linux.tar.gz && mv oc kubectl /usr/bin/

# Install node dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
RUN yarn

# Install crl
WORKDIR /root
RUN apt-get install -y git
ARG CRL_CACHE_BUST=1
RUN echo "$CRL_CACHE_BUST" && pip3 install git+https://github.com/CakeRobotics/crl

# Copy service code
WORKDIR /app
COPY . ./
ENV CONFIG=arvan-docker
ENTRYPOINT ["yarn", "start"]
