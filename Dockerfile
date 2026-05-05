FROM node:lts as build

WORKDIR /usr/local/app

COPY ./package.json /usr/local/app/
COPY ./package-lock.json /usr/local/app/
COPY ./src /usr/local/app/src
COPY ./prisma /usr/local/app/prisma
COPY ./prisma.config.ts /usr/local/app/
COPY ./tsconfig.json /usr/local/app/

RUN npm install
RUN npx prisma generate
RUN npm run build

FROM node:lts

WORKDIR /usr/local/app
COPY --from=build /usr/local/app/node_modules /usr/local/app/node_modules
COPY --from=build /usr/local/app/generated /usr/local/app/node_modules
COPY --from=build /usr/local/app/dist /usr/local/app/dist
COPY --from=build /usr/local/app/prisma /usr/local/app/prisma
COPY --from=build /usr/local/app/prisma.config.ts /usr/local/app/

EXPOSE 3000

CMD npx prisma migrate deploy && node dist/app.js