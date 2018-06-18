import validator from 'validator';
import { commonValidationMessages } from '../constants/validationMessages.js';

export const validateId = (id) => {
	if (!validator.isNumeric(id)) {
		throw new Error(commonValidationMessages.id.isNotNumeric);
	}
};
