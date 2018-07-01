import { memberValidationMessages } from '../constants/validationMessages.js';

export const validateMember = ({ username, contactNumber }) => {

	let validationError = '';

	if (username === '' || typeof (username) === 'number') {
		validationError += memberValidationMessages.username.isEmpty;
	}
	else if (!username.match(/[a-zA-Z0-9\s]{6,12}/i)) {
		validationError += memberValidationMessages.username.formatMismatch;
	}

	if (typeof (contactNumber) === 'number') {
		validationError += memberValidationMessages.contactNumber.typeMismatch;
	}
	else if (contactNumber && !(contactNumber.match(/^\d+$/))) {
		validationError += memberValidationMessages.contactNumber.formatMismatch;
	}

	if (validationError) {
		throw Error (validationError);
	}
	else {
		return undefined;
	}
};
