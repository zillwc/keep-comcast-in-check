FROM node:8

ENV HOME=/srv/package
ENV APP_USER=appuser

WORKDIR ${HOME}

RUN groupadd -r ${APP_USER} && useradd -r -g ${APP_USER} ${APP_USER}

COPY package.json ${HOME}/package.json
COPY package-lock.json ${HOME}/package-lock.json
COPY lib ${HOME}/lib
COPY CONFIG ${HOME}/CONFIG

RUN npm install --verbose

USER ${APP_USER}

CMD ["npm", "run", "start"]
