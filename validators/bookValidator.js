import { bookValidationMessages } from '../constants/validationMessages.js';

const validateName = (name) => {
	if (!name || !(typeof (name) === 'string')) {
		return bookValidationMessages.name.isEmpty;
	}
	else if (!name.match(/[a-zA-Z0-9\s]{6,20}/i)) {
		return bookValidationMessages.name.formatMismatch;
	}
	else {
		return '';
	}
};

const validateAuthor = (author) => {
	if (!author || !(typeof (author) === 'string')) {
		return bookValidationMessages.author.isEmpty;
	}
	else {
		return '';
	}
};

const validateShelfNumber = (shelfNumber) => {
	if (!shelfNumber || !(typeof (shelfNumber) === 'string')) {
		return bookValidationMessages.shelfNumber.isEmpty;
	}
	else {
		return '';
	}
};

const validatePublishedDate = (publishedDate) => {
	if (publishedDate && !publishedDate.match(/[1,2][7,8,9,0][0-9]{2}-[0-9]{2}-[0-9]{2}/)) {
		return bookValidationMessages.publishedDate.isEmpty;
	}
	else {
		return '';
	}
};

const validateEdition = (edition) => {
	if (edition && !(typeof (edition) === 'string')) {
		return bookValidationMessages.edition.isEmpty;
	}
	else {
		return '';
	}
};

export const validateBook = ({ name, author, edition, publishedDate, shelfNumber }, { operation = 'noop' }) => {

	let validationError = '';

	if (operation === 'add') {

		validationError += validateName(name);
		validationError += validateAuthor(author);
		validationError += validateShelfNumber(shelfNumber);
		validationError += validatePublishedDate(publishedDate);
		validationError += validateEdition(edition);

	}

	if (operation === 'update') {

		validationError += name !== undefined ? validateName(name) : '';
		validationError += author !== undefined ? validateAuthor(author) : '';
		validationError += shelfNumber !== undefined ? validateShelfNumber(shelfNumber) : '';
		validationError += publishedDate !== undefined ? validatePublishedDate(publishedDate) : '';
		validationError += edition !== undefined ? validateEdition(edition) : '';

	}

	if (validationError) {
		return validationError;
	}
	else {
		return undefined;
	}

};
