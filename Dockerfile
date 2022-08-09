FROM node as builder 
WORKDIR /graphql
COPY . .
RUN npm ci

FROM node
WORKDIR /graphql
COPY package*.json ./
RUN npm install --productionx
EXPOSE 4000
CMD dir && npm run start
