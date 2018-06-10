export const validateMember = ({ username, contactNumber }) => {

	let validationError = '';

	if (username === '' || typeof (username) === 'number') {
		validationError += 'Username cannot be empty and it should be a string, should be between 6-12 characters/digits. Cannot contain special characters. ';
	}
	else if (!username.match(/[a-zA-Z0-9\s]{6,12}/i)) {
		validationError += 'Username should be between 6-12 characters/digits. Cannot contain special characters. ';
	}

	if (typeof (contactNumber) === 'number') {
		validationError += 'Contact number should be a string. ';
	}
	else if (contactNumber && !(contactNumber.match(/^\d+$/))) {
		validationError += 'Contact number can contain only numbers. ';
	}

	if (validationError) {
		throw Error(validationError);
	}

};
