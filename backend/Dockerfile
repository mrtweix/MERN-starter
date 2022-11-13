FROM node:lts-alpine

WORKDIR /backend

COPY ./ ./

RUN npm install
# RUN npm ci --only=production

EXPOSE 5002

CMD ["npm", "start"]