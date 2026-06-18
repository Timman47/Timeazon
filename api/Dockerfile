FROM node:22-alpine

WORKDIR /app/api

COPY api/package*.json ./

RUN npm install

COPY api/ ./
COPY CDK/ ../CDK

EXPOSE 3000

CMD ["node", "server.js"]
