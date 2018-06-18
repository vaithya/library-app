import express from 'express';
import { requestHandler } from '../middleware/handlers.js';
import BookFunctions from '../logic/book.js';

export const bookRouter = () => {

	const bookRouter = express.Router();

	/**
	 * @swagger
	 * /api/books:
	 *   post:
	 *     description: Adds a book to the library
	 *     tags:
	 *       - Books
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *        - in: body
	 *          name: body
	 *          schema:
	 *            type: object
	 *            properties:
	 *              name:
	 *                type: string
	 *              author:
	 *                type: string
	 *              publishedDate:
	 *                type: string
	 *              edition:
	 *                type: string
	 *              shelfNumber:
	 *                type: string
	 *     responses:
	 *        "201":
	 *           description: Added the book successfully.
	 *        "400":
	 *           description: Bad request. Invalid input. Missing/Incorrect input.
	 *        "500":
	 *           description: Unable to process the request.
	 */
	bookRouter.post ('/books', (req, res) => requestHandler(req, res, BookFunctions.addBook));

	/**
	 * @swagger
	 * /api/books:
	 *   get:
	 *     description: Gets all books from the library
	 *     tags:
	 *       - Books
	 *     produces:
	 *       - application/json
	 *     responses:
	 *        "200":
	 *           description: Returns the books.
	 *        "500":
	 *           description: Unable to process the request.
	 */
	bookRouter.get ('/books', (req, res) => requestHandler(req, res, BookFunctions.getAllBooks));

	/**
	 * @swagger
	 * /api/books/{id}:
	 *   get:
	 *     description: Gets a book from the library
	 *     tags:
	 *       - Books
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         description: The id of the book you want to get.
	 *     responses:
	 *        "200":
	 *           description: Returns the book if available. Returns message if unavailable.
	 *        "500":
	 *           description: Unable to process the request.
	 */
	bookRouter.get ('/books/:id', (req, res) => requestHandler(req, res, BookFunctions.getBook));

	/**
	 * @swagger
	 * /api/books/availability/{id}:
	 *   get:
	 *     description: Checks whether the book is available or not.
	 *     tags:
	 *       - Books
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         description: The id of the book you want to check availability for.
	 *     responses:
	 *        "200":
	 *           description: Returns the availability status.
	 *        "500":
	 *           description: Unable to process the request.
	 */
	bookRouter.get ('/books/availability/:id', (req, res) => requestHandler(req, res, BookFunctions.getBookAvailability));

	/**
	 * @swagger
	 * /api/books/{id}:
	 *   patch:
	 *     description: Updates properties of a book.
	 *     tags:
	 *       - Books
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         description: The id of the book you want to update properties.
	 *       - in: body
	 *         name: body
	 *         schema:
	 *            type: object
	 *            properties:
	 *              name:
	 *                type: string
	 *              author:
	 *                type: string
	 *              publishedDate:
	 *                type: string
	 *              edition:
	 *                type: string
	 *              shelfNumber:
	 *                type: string
	 *     responses:
	 *        "200":
	 *           description: Updated successfully. Book is not available.
	 *        "400":
	 *           description: Bad request. Missing/Incorrect input. Received no properties to update.
	 *        "500":
	 *           description: Unable to process the request.
	 */
	bookRouter.patch ('/books/:id', (req, res) => requestHandler(req, res, BookFunctions.updateBook));

	/**
	 * @swagger
	 * /api/books/{id}:
	 *   delete:
	 *     description: Removes a book from the library
	 *     tags:
	 *       - Books
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         description: The id of the book you want to remove.
	 *     responses:
	 *        "200":
	 *           description: Deleted the book successfully. Book is not available.
	 *        "400":
	 *           description: Bad request. Invalid input. Missing/Incorrect input.
	 *        "500":
	 *           description: Unable to process the request.
	 */
	bookRouter.delete ('/books/:id', (req, res) => requestHandler(req, res, BookFunctions.deleteBook));

	return bookRouter;
};

