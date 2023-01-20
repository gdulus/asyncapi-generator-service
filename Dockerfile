FROM asyncapi/generator

RUN npm install express --save

COPY ./app.js /app/app.js

ENTRYPOINT ["node", "/app/app.js"]
