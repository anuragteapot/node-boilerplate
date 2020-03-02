const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const fs = require('fs');
const { join } = require('path');

const PORT = process.env.PORT || 3344;
const connectionURI = require('../db/connectionURI');
const staticPath = require('../config/env')[process.env.NODE_ENV].static;
const logs = require('../helpers/logs');
const models = join(__dirname, '../models');
const app = express();

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

staticPath.forEach(path => {
  let url = path.url || path.dir;
  if (url && path.dir) {
    logs(`Loaded static folder: ${join(__dirname, path.dir)}`);
    app.use(url, express.static(join(__dirname, path.dir)));
  }
});

app.use('/ping', (req, res) => {
  res.status(200).send('<h1 style="text-align:center;">👻 Fred Foo 👻</h1>');
});

const routes = require('../routes');
Object.keys(routes).forEach(routeName => {
  logs(`Loaded route: ${routeName}`);
  app.use(`/api/${routeName}`, routes[routeName]);
});

app.use('*', (req, res) => {
  res
    .status(404)
    .send('<h1 style="text-align:center;">🤷‍♂️ 👻 Route not found 👻 🤷‍♂️</h1>');
});

const listen = () => {
  logs(`Database connected at ${connectionURI}`);
  app.listen(PORT, () => {
    logs(`App listen on port ${PORT}`, 'log', true);
  });
};

const connect = () => {
  const options = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };
  mongoose.connect(connectionURI, options);
  return mongoose.connection;
};

connect()
  .on('error', logs)
  .on('disconnected', connect)
  .once('open', listen);
