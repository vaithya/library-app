const express = require('express');
const bodyParser = require('body-parser');
import logger from '../logger.js';
import { db } from '../db/db.js';
import { bookRouter } from '../controllers/bookController.js';
import { memberRouter } from '../controllers/memberController.js';
import { bookTransactionsRouter } from '../controllers/bookTransactionsController.js';

const app = express();
const port = 8080;

app.use((req, res, next) => {
	logger.info(`Incoming request.`);
	next();
});

app.use(bodyParser.json());

app.use('/api', bookRouter());
app.use('/api', memberRouter());
app.use('/api', bookTransactionsRouter());

const httpServer = app.listen(port, () => {
	db.syncSchema();
	logger.info(`Server is running on port ${port}.`);
	app.emit('serverStarted');
});

app.shutDown = () => {
	logger.info('shutting down library app');

	return new Promise((resolve, reject) => {
		httpServer.close(() => {
			logger.info('closed http server.');
			resolve(1);
		});
	});
};

export default app;
