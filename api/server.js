const express = require('express');

const server = express();

const userRouter = require('./users/users-router');
const { logger} = require('./middleware/middleware');
const { validateUserId } = require('./middleware/middleware');
const { validateUser} = require('./middleware/middleware');

// global middlewares and the user's router need to be connected here


server.use(express.json());
server.use(logger);

server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;


