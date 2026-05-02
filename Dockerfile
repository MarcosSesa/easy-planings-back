FROM node:lts AS build

WORKDIR /usr/local/app

COPY ./package.json /usr/local/app/
COPY ./package-lock.json /usr/local/app/
COPY ./tsconfig.json /usr/local/app/
COPY ./src /usr/local/app/src
COPY ./prisma /usr/local/app/prisma

RUN npm install
RUN npx tsc

FROM node:lts

WORKDIR /usr/local/app
COPY --from=build /usr/local/app/node_modules /usr/local/app/node_modules
COPY --from=build /usr/local/app/dist /usr/local/app/dist
COPY --from=build /usr/local/app/prisma /usr/local/app/prisma
COPY ./package.json /usr/local/app/

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
