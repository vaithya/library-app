import validator from 'validator';

export const validateId = (id) => {
	if (!validator.isNumeric(id)) {
		throw new Error('Id request parameter can contain only numbers.');
	}
};
