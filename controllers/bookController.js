import express from 'express';
import { requestHandler } from '../middleware/handlers.js';
import BookFunctions from '../logic/book.js';

export const bookRouter = () => {

    const bookRouter = express.Router();
    // Have a single handler for POST, pass type = 'CREATE' or 'BORROW' etc to redirect to correct function.  
    // Don't use verbs in the route.
    bookRouter.post   ('/books',                  async (req, res) => requestHandler(req, res, BookFunctions.addBook));
    bookRouter.get    ('/books',                  async (req, res) => requestHandler(req, res, BookFunctions.getAllBooks));
    bookRouter.get    ('/books/:id',              async (req, res) => requestHandler(req, res, BookFunctions.getBook));
    bookRouter.get    ('/books/availability/:id', async (req, res) => requestHandler(req, res, BookFunctions.getBookAvailability));
    // Patch needs you to pass all properties of a book now. Need to change that. 
    bookRouter.patch  ('/books/:id',              async (req, res) => requestHandler(req, res, BookFunctions.updateBook));
    bookRouter.post   ('/books/borrow',           async (req, res) => requestHandler(req, res, BookFunctions.borrowBook));
    bookRouter.post   ('/books/return',           async (req, res) => requestHandler(req, res, BookFunctions.returnBook));
    bookRouter.delete ('/books/:id',              async (req, res) => requestHandler(req, res, BookFunctions.deleteBook));

    return bookRouter;
};

