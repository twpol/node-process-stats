FROM node:10.21-alpine

WORKDIR /app
COPY --chown=node:node . /app
USER node
CMD ["node", "test/index.js"]
