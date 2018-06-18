export const bookValidationMessages = {
	name: {
		isEmpty: 'Name of the book cannot be empty, should be a string. ',
		formatMismatch: 'Name of the book has to contain between 6 and 20 characters and it cannot contain special characters. ',
	},
	author: {
		isEmpty: 'Author of the book cannot be empty and it should be a string. ',
	},
	shelfNumber: {
		isEmpty: 'Shelf number of the book cannot be empty and it should be a string. ',
	},
	publishedDate: {
		isEmpty: 'Published date of the book is not valid. ',
	},
	edition: {
		isEmpty: 'Edition number of the book is not valid. It has to be a number. ',
	},
};

export const memberValidationMessages = {
	username: {
		isEmpty: 'Username cannot be empty and it should be a string, should be between 6-12 characters/digits. Cannot contain special characters. ',
		formatMismatch: 'Username should be between 6-12 characters/digits. Cannot contain special characters. ',
	},
	contactNumber: {
		typeMismatch: 'Contact number should be a string. ',
		formatMismatch: 'Contact number can contain only numbers. ',
	},
};

export const commonValidationMessages = {
	id: {
		isNotNumeric: 'Id request parameter can contain only numbers. ',
	},
}
;