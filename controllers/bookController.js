import express from 'express';
import { requestHandler } from '../middleware/handlers.js';
import BookFunctions from '../logic/book.js';

export const bookRouter = () => {

    const bookRouter = express.Router();
    // Have a single handler for POST, pass type = 'CREATE' or 'BORROW' etc to redirect to correct function.
    bookRouter.post   ('/books',                  async (req, res) => requestHandler(req, res, BookFunctions.addBook));
    bookRouter.get    ('/books',                  async (req, res) => requestHandler(req, res, BookFunctions.getAllBooks));
    bookRouter.get    ('/books/:id',              async (req, res) => requestHandler(req, res, BookFunctions.getBook));
    bookRouter.get    ('/books/availability/:id', async (req, res) => requestHandler(req, res, BookFunctions.getBookAvailability));
    bookRouter.patch  ('/books/:id',              async (req, res) => requestHandler(req, res, BookFunctions.updateBook));
    bookRouter.post   ('/books/borrow',           async (req, res) => requestHandler(req, res, BookFunctions.borrowBook));
    bookRouter.post   ('/books/return',           async (req, res) => requestHandler(req, res, BookFunctions.returnBook));
    bookRouter.delete ('/books/:id',              async (req, res) => requestHandler(req, res, BookFunctions.deleteBook));
    // Don't use verbs in the route.
    return bookRouter;
};

