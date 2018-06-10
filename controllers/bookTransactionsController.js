import express from 'express';
import { requestHandler } from '../middleware/handlers.js';
import BookTransactions from '../logic/bookTransactions.js';

export const bookTransactionsRouter = () => {

	const bookTransactionsRouter = express.Router();

	/**
	 * @swagger
	 * /api/members/:memberId/books/:bookId:
	 *   post:
	 *     description: Borrow / Return a book.
	 *     tags:
	 *       - Book Transactions
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: path
	 *         name: book id
	 *         description: The id of the book you want to borrow / return.
	 *       - in: path
	 *         name: book id
	 *         description: The id of the member who wants to do this transaction.
	 *       - in: body
	 *         name: body
	 *         schema:
	 *            type: object
	 *            properties:
	 *              transactionType:
	 *                type: string
	 *     responses:
	 *        "200":
	 *           description: Transaction successful / Book not available.
	 *           examples:
	 *             application/json: |-
	 *               {
	 *                 "transactionType": "BORROW"
	 *               }
	 *               {
	 *                 "transactionType": "RETURN"
	 *               }
	 *        "400":
	 *           description: Bad request.
	 *        "401":
	 *           description: Unregistered member trying to make this transaction.
	 *        "422":
	 *           description: Missing/Incorrect input.
	 *        "500":
	 *           description: Unable to process the request.
	 */
	bookTransactionsRouter.post ('/members/:memberId/books/:bookId', (req, res) => requestHandler(req, res, BookTransactions.handleBookTransactions));

	return bookTransactionsRouter;

};
