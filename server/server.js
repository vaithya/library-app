const express = require('express');
const bodyParser = require('body-parser');
import logger from '../logger.js';
import { db } from '../db/db.js'
import { bookRouter } from '../controllers/bookController.js';
import { memberRouter } from '../controllers/memberController.js';

const app = express();
const port = 8080;

app.use((req, res, next) => {
  logger.info(`Incoming request.`);
  next();
});

app.use(bodyParser.json());

app.use('/api', bookRouter());
app.use('/api', memberRouter());

if (process.env.NODE_ENV !== 'test') {

  app.listen(port, () => {
    db.syncSchema();
    console.log(`Server is running on port ${port}.`);
  })
  
}

export default app;