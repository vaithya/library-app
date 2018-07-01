import logger from '../logger.js';
import HttpStatus from 'http-status-codes';

export const requestHandler = async (req, res, requestHandlerFunction) => {

	let result = {};

	try {

		result = await requestHandlerFunction(req);

	}
	catch (error) {

		logger.error(error);

		result.status = HttpStatus.BAD_REQUEST;

		result.result = 'Unable to process your request.';

		if (error) {
			result.error = error.toString();
		}

	}

	let jsonToReturn = {};

	if (result.json) {

		jsonToReturn.result = 'Your request has been processed successfully.';
		jsonToReturn.data = result.json;

	}
	else {

		jsonToReturn = {
			result: result.result,
		};

		if (result.error) {
			jsonToReturn.error = result.error.toString();
			jsonToReturn.data = {};
		}
	}

	logger.info(JSON.stringify(jsonToReturn));

	res.status(result.status).json(jsonToReturn);

};
