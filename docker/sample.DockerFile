FROM ubuntu:16.04
MAINTAINER @luisfidelis - luizsale10@gmail.com

ENV COMMITS_MINER_REPOSITORY git@github.com:mateusfreira/commits-miner.git
ENV SCRIPTS_REPOSITORY git@github.com:mateusfreira/github-sentiment-analysis-code-smells-scripts.git

ENV MONGO_DB_URL ""
ENV MONGO_DB_USER ""
ENV MONGO_DB_PASSWORD ""
ENV MONGO_DB_AUTHDB ""

ENV GITHUB_TOKENS ""
ENV IMAGE_USER commits
ENV IMAGE_PASSWORD 123456
ENV COMMITS_MINER_HOME /home/${IMAGE_USER}

# add credentials on build
ARG SSH_PRIVATE_KEY
RUN mkdir /root/.ssh/
RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa

# make sure your domain is accepted
RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts

# Install environment dependencies
RUN apt-get update && apt-get install -y git
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash
RUN apt-get install -y nodejs

# Create user ${IMAGE_USER}
RUN useradd -ms /bin/bash ${IMAGE_USER} && \
    echo "${IMAGE_USER}:${IMAGE_PASSWORD}" | chpasswd

# Go on user
USER ${IMAGE_USER}
WORKDIR ${COMMITS_MINER_HOME}

# Config npm global dir
RUN mkdir ${COMMITS_MINER_HOME}/.npm-global && \
    npm config set prefix '${COMMITS_MINER_HOME}/.npm-global' && \
    echo "export PATH=${COMMITS_MINER_HOME}/.npm-global/bin:$PATH" >> ${COMMITS_MINER_HOME}/.profile && \
    export PATH=${COMMITS_MINER_HOME}/.npm-global/bin:$PATH 

# add credentials on build
ARG SSH_PRIVATE_KEY
RUN mkdir /root/.ssh/
RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa

# make sure your domain is accepted
RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

# Clone and build commits-miner
RUN mkdir ./www && \
    export PATH=${COMMITS_MINER_HOME}/.npm-global/bin:$PATH && \
    cd ./www && \
    git clone ${SCRIPTS_REPOSITORY} && \
    cd ./github-sentiment-analysis-code-smells-scripts && \
    npm install && \
    cd .. && \
    git clone ${COMMITS_MINER_REPOSITORY} && \
    npm install && \
    printf '{"mongo": {"url" : "${MONGO_DB_URL}", "opt": {"user": "${MONGO_DB_USER}", "pass": "${MONGO_DB_PASSWORD}", "auth": {"authdb": "${MONGO_DB_AUTHDB}"}}}, "github":{"tokens":["${GITHUB_TOKENS}"]}}' >> config/default.json
EXPOSE 8080
WORKDIR ${COMMITS_MINER_HOME}/www/commits-miner
CMD npm run server && \
    npm run client