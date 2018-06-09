import express from 'express';
import { requestHandler } from '../middleware/handlers.js';
import BookTransactions from '../logic/bookTransactions.js';

export const bookTransactionsRouter = () => {

    const bookTransactionsRouter = express.Router();

    bookTransactionsRouter.post   ('/members/:memberId/books/:bookId',              async (req, res) => requestHandler(req, res, BookTransactions.handleBookTransactions));

    return bookTransactionsRouter;

};