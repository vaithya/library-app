import express from 'express';
import { requestHandler } from '../middleware/handlers.js';
import BookFunctions from '../logic/book.js';

export const bookRouter = () => {

    const bookRouter = express.Router();

    bookRouter.post   ('/books',                  async (req, res) => requestHandler(req, res, BookFunctions.addBook));
    bookRouter.get    ('/books',                  async (req, res) => requestHandler(req, res, BookFunctions.getAllBooks));
    bookRouter.get    ('/books/:id',              async (req, res) => requestHandler(req, res, BookFunctions.getBook));
    bookRouter.get    ('/books/availability/:id', async (req, res) => requestHandler(req, res, BookFunctions.getBookAvailability));
    bookRouter.patch  ('/books/:id',              async (req, res) => requestHandler(req, res, BookFunctions.updateBook));
    bookRouter.delete ('/books/:id',              async (req, res) => requestHandler(req, res, BookFunctions.deleteBook));

    return bookRouter;
};

