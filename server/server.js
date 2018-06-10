const express = require('express');
const bodyParser = require('body-parser');
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import logger from '../logger.js';
import { db } from '../db/db.js';
import { bookRouter } from '../controllers/bookController.js';
import { memberRouter } from '../controllers/memberController.js';
import { bookTransactionsRouter } from '../controllers/bookTransactionsController.js';

logger.info('Setting up express app.');
const app = express();
const port = 8080;

app.use((req, res, next) => {
	logger.info(`Incoming request.`);
	next();
});

app.use(bodyParser.json());

logger.info('Adding routes.');

app.use('/api', bookRouter());
app.use('/api', memberRouter());
app.use('/api', bookTransactionsRouter());

const httpServer = app.listen(port, () => {

	db.syncSchema();

	logger.info(`Server is running on port ${port}.`);

	const swaggerDefinition = {
		info: {
			title: 'Library APIs',
			version: '1.0',
			description: 'APIs for interacting with the library application.',
		},
		schemes: [ 'http' ],
	};


	const options = {
		swaggerDefinition,
		apis: [
			'./controllers/bookController.js',
			'./controllers/memberController.js',
			'./controllers/bookTransactionsController.js',
		],
	};

	const swaggerSpec = swaggerJsDoc(options);

	app.use('/api-docs', swaggerUI.serve, (req, res, next) => {
		swaggerUI.setup(swaggerSpec)(req, res);
		next();
	});

	app.get('/swagger.json', function(req, res) {
		res.json(swaggerSpec);
	});

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
