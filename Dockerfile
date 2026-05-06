FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY index.html styles.css game.js multiplayer-client.js ./
COPY server ./server
COPY shared ./shared
COPY assets ./assets
COPY ARCHITECTURE_MULTIPLAYER.md DEPLOYMENT_MULTIPLAYER.md MULTIPLAYER_TEST_FLOW.md ./

EXPOSE 8787
CMD ["node", "server/server.js"]

