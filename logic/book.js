import Sequelize from 'sequelize';
import { db } from '../db/db.js';
import logger from '../logger.js';
import HttpStatus from 'http-status-codes';
import { validateBook } from '../validators/bookValidator.js';
import { validateId } from '../validators/commonValidator.js';
import { bookProperties } from '../constants/bookProperties.js';

class Book {

	constructor () {
		// Need 'this' to be defined to access checkBookAvailability within borrowBook.
		// All methods were static previously, but 'this' was undefined inside those methods when the methods were passed as arguments to the handler.
		this.checkBookAvailability = this.checkBookAvailability.bind(this);
		this.getBookAvailability = this.getBookAvailability.bind(this);
	}

	async addBook (req) {

		const bookToAdd = req.body;
		let createdBook;
		let existingBook;
		let validationError;

		try {
			validationError = validateBook(bookToAdd, { operation: 'add' });
		}
		catch (error) {
			throw Error(error);
		}

		if (validationError) {
			return {
				status: HttpStatus.UNPROCESSABLE_ENTITY,
				result: 'Invalid input.',
				error: validationError,
			};
		}

		const { name, author, edition } = bookToAdd;

		try {

			existingBook = await db.book.findAll({
				where: {
					deleted: { [Sequelize.Op.ne]: true },
					name,
					author,
					edition,
				},
			});

			if (existingBook.length === 0) {
				createdBook = await db.book.create({
					...bookToAdd,
					noOfBooksAvailable: 1,
				});
			}
			else {

				await db.book.update({
					noOfBooksAvailable: existingBook[0].noOfBooksAvailable + 1,
				}, {
					where: {
						id: existingBook[0].id,
					},
				});

				createdBook = existingBook[0];
				createdBook.noOfBooksAvailable += 1;
			}

			return {
				status: HttpStatus.CREATED,
				result: 'This book has been added to our library.',
			};

		}
		catch (error) {

			logger.error(error);
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				result: 'Unable to create books at the moment.',
				error,
			};

		}
	}

	async getAllBooks (req) {

		let allBooks;
		try {

			allBooks = await db.book.findAll({
				where: {
					deleted: { [Sequelize.Op.ne]: true },
				},
			});

			return {
				status: HttpStatus.OK,
				json: allBooks,
			};

		}
		catch (error) {

			logger.error(error);
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				result: 'Unable to fetch books at the moment.',
				error,
			};

		}
	}

	async getBook (req) {

		validateId(req.params.id);

		let book;
		try {

			book = await db.book.findOne({
				where: {
					id: req.params.id,
					deleted: { [Sequelize.Op.ne]: true },
				},
			});

			if (!book) {
				return {
					status: HttpStatus.OK,
					result: 'The requested book is not available now.',
				};
			}
			else {
				return {
					status: HttpStatus.OK,
					json: book,
				};
			}

		}
		catch (error) {

			logger.error(error);
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				result: 'Unable to get this book at the moment.',
				error,
			};

		}
	}

	async checkBookAvailability (id) {

		validateId(id);

		try {

			const existingBook = await db.book.findOne({
				where: {
					id: id,
					deleted: { [Sequelize.Op.ne]: true },
				},
			});

			if (!existingBook) {
				return false;
			}
			else {

				const availabilityStatus = existingBook.noOfBooksAvailable > 0 ? true : false;

				return availabilityStatus;
			}

		}
		catch (error) {

			logger.error(error);
			return 'ERROR';

		}
	}

	async updateBook (req) {

		const propertiesToUpdate = {};
		let validationError;

		for (const key of Object.keys(req.body)) {
			if (bookProperties[key]) {
				propertiesToUpdate[key] = req.body[key];
			}
		}

		const propertyKeys = Object.keys(propertiesToUpdate);

		if (propertyKeys.length > 0) {
			try {
				validationError = validateBook(propertiesToUpdate, { operation: 'update' });
			}
			catch (error) {
				throw Error(error);
			}

			if (validationError) {
				return {
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					result: 'Invalid input.',
					error: validationError,
				};
			}
		}
		else {
			return {
				status: HttpStatus.UNPROCESSABLE_ENTITY,
				result: 'Received no properties to update.',
			};
		}

		try {

			// Move the below query into a separate sub, as it is common for many subs.
			const existingBook = await db.book.findOne({
				where: {
					id: req.params.id,
					deleted: { [Sequelize.Op.ne]: true },
				},
			});

			if (!existingBook) {
				return {
					status: HttpStatus.OK,
					result: 'The requested book is not available to be updated.',
				};
			}
			else {
				await db.book.update(propertiesToUpdate, {
					where: {
						id: req.params.id,
					},
				});

				return {
					status: HttpStatus.OK,
					result: 'The properties of this book have been updated.',
				};
			}

		}
		catch (error) {

			logger.error(error);
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				result: 'Unable to update this book at the moment.',
				error,
			};

		}
	}

	async deleteBook (req) {

		validateId(req.params.id);

		try {

			const existingBook = await db.book.findOne({
				where: {
					id: req.params.id,
					deleted: { [Sequelize.Op.ne]: true },
				},
			});

			if (!existingBook) {
				return {
					status: HttpStatus.OK,
					result: 'The requested book is not available to be deleted.',
				};
			}
			else {

				await db.book.update({
					deleted: true,
				}, {
					where: {
						id: req.params.id,
					},
				});

				return {
					status: HttpStatus.OK,
					result: 'The requested book has been marked as deleted in the library records.',
				};
			}

		}
		catch (error) {

			logger.error(error);
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				result: 'Unable to delete this book at the moment.',
				error,
			};
		}
	}

	async getBookAvailability (req) {

		validateId(req.params.id);

		const availability = await this.checkBookAvailability(req.params.id);

		if (availability === 'ERROR') {
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				result: 'Unable to check availability at the moment.',
			};
		}
		else {
			return {
				status: HttpStatus.OK,
				json: { availability },
			};
		}
	}
}

const bookInstance = new Book();

export default bookInstance;
