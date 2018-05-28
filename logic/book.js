import Sequelize from 'sequelize';
import { db } from '../db/db.js';
import logger from '../logger.js';
import HttpStatus from 'http-status-codes';
import { validateBook } from '../utils/util.js';

class Book {

    constructor () {
        // Need 'this' to be defined to access checkBookAvailability within borrowBook.
        // All methods were static previously, but 'this' was undefined inside those methods when the methods were passed as arguments to the handler.

        this.borrowBook = this.borrowBook.bind(this);
        this.checkBookAvailability = this.checkBookAvailability.bind(this);
        this.getBookAvailability = this.getBookAvailability.bind(this);
    }

    async addBook (req) {
        console.log(JSON.stringify(req.body,0,2));
        const { name = '', author = '', edition = '', publishedDate = '', shelfNumber = '' } = req.body;
        let createdBook;
        let existingBook;
        
        validateBook(name, author, edition, publishedDate, shelfNumber);

        try {

            existingBook = await db.book.findAll({
                where: {
                    deleted: { [Sequelize.Op.ne]: true },
                    name,
                    author,
                    edition
                }
            });

            if (existingBook.length === 0) {
                createdBook = await db.book.create({
                    name,
                    author,
                    edition,
                    shelfNumber,
                    publishedDate,
                    noOfBooksAvailable: 1
                });

            }
            else {

                await db.book.update({
                    noOfBooksAvailable: existingBook[0].noOfBooksAvailable + 1
                }, {
                    where: {
                        id: existingBook[0].id
                    }
                });

                createdBook = existingBook[0];
                createdBook.noOfBooksAvailable += 1;
            }

            return {
                status: HttpStatus.CREATED,
                result: 'This book has been added to our library.'
            };

        }
        catch (error) {

            logger.error(error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                result: 'Unable to create books at the moment.',
                error
            }

        }
    }

    async getAllBooks (req) {

        let allBooks;
        try {

            allBooks = await db.book.findAll({
                where: {
                    deleted: { [Sequelize.Op.ne]: true }
                }
            });

            return {
                status: HttpStatus.OK,
                json: allBooks
            }

        }
        catch (error) {

            logger.error(error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                result: 'Unable to fetch books at the moment.',
                error
            }

        }
    }

    async getBook (req) {

        let book;
        try {

            book = await db.book.findOne({
                where: {
                    id: req.params.id,
                    deleted: { [Sequelize.Op.ne]: true }
                }
            })

            if(!book) {
                return {
                    status: HttpStatus.OK,
                    result: 'The requested book is not available now.'
                }
            }

            return {
                status: HttpStatus.OK,
                json: book
            }
            
        }
        catch (error) {

            logger.error(error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                result: 'Unable to get this book at the moment.',
                error
            }

        }
    }

    async checkBookAvailability (id) {
        try {

            const existingBook = await db.book.findOne({
                where: {
                    id: id,
                    deleted: { [Sequelize.Op.ne]: true }
                }
            });
           
            if (!existingBook) {
               return false;
            }
 
            const availabilityStatus = existingBook.noOfBooksAvailable > 0 ? true : false;

            return availabilityStatus;

        }
        catch (error) {

            logger.error(error);
            return 'ERROR';

        }
    }

    async borrowBook (req) {

        const bookId = req.body.bookId;
        const memberId = req.body.memberId;
       
        const existingMember = await db.member.findOne({
            where: {
                id: memberId,
                unRegisteredYN: { [Sequelize.Op.eq]: false }
            }
        });

        if (!existingMember) {
            return {
                status: HttpStatus.FORBIDDEN,
                result: `You must be a registered member to borrow this book. Please register first.`
            }
        }

        if (existingMember.amountDue > 0) {
            return {
                status: HttpStatus.FORBIDDEN,
                result: `Please pay your due amount ${existingMember.amountDue} to borrow this book.`
            }
        }
       
        const bookAvailability = await this.checkBookAvailability(bookId);
        
        if (bookAvailability === true) {

            try {

                const book = await db.book.findOne({
                    where: {
                        id: bookId,
                        deleted: { [Sequelize.Op.ne]: true }
                    }
                });

                await db.book.update({
                    noOfBooksAvailable: book.noOfBooksAvailable - 1
                }, {
                    where: {
                        id: bookId
                    }
                });

                await db.member.update({
                    noOfBooksTaken: existingMember.noOfBooksTaken + 1
                }, {
                    where: {
                        id: memberId
                    }
                });

                return {
                    status: HttpStatus.OK,
                    result: 'One copy of the requested book has been lent to you.'
                }

            }
            catch (error) {

                logger.error(error);
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    result: 'Unable to lend this book at the moment due to technical issues.',
                    error
                }

            }
        }
        else if (bookAvailability === false) {
            return {
                status: HttpStatus.OK,
                result: 'This book is not available at the moment.'
            }
        }
        else {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                result: 'Unable to lend this book at the moment due to technical issues.'
            }
        }
    }

    async returnBook (req) {

        const bookId = req.body.bookId;
        const memberId = req.body.memberId;

        try {

            const book = await db.book.findOne({
                where: {
                    id: bookId,
                    deleted: { [Sequelize.Op.ne]: true }
                }
            });

            const existingMember = await db.member.findOne({
                where: {
                    id: memberId,
                    unRegisteredYN: { [Sequelize.Op.ne]: true }
                }
            });
            
            if (!existingMember) {
                return {
                    status: HttpStatus.FORBIDDEN,
                    result: `You must be a registered member to return a book. Please register first.`
                }
            }

            if (!book) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    result: 'We did not lend you this book. Please check.'
                }
            }

            await db.book.update({
                noOfBooksAvailable: book.noOfBooksAvailable + 1
            }, {
                where: {
                    id: bookId
                }
            });

            await db.member.update({
                noOfBooksTaken: existingMember.noOfBooksTaken - 1
            }, {
                where: {
                    id: memberId
                }
            });

            return {
                status: HttpStatus.OK,
                result: 'The return of your book has been accepted.'
            }

        }
        catch (error) {

            logger.error(error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                result: 'Unable to accept this book at the moment due to technical issues.',
                error
            }

        }
    }

    async updateBook (req) {

        const { name = '', author = '', publishedDate = '', edition = '', shelfNumber = '' } = req.body;
        // Instead of updating all the values, find the diff and update that alone.
        let updatedBook;

        validateBook(name, author, edition, publishedDate, shelfNumber);

        try {

            // Move the below query into a separate sub, as it is common for many subs.
            const existingBook = await db.book.findOne({
                where: {
                    id: req.params.id,
                    deleted: { [Sequelize.Op.ne]: true }
                }
            });

            if (!existingBook) {
                return {
                    status: HttpStatus.OK,
                    result: 'The requested book is not available to be updated.'
                }
            }

           let updates = {};

           // BUG: This overwrites all fields as '' if you don't pass in anything.

            await db.book.update({
                name,
                author,
                edition,
                shelfNumber,
                publishedDate
            }, {
                where: {
                    id: req.params.id
                }
            });

            return {
                status: HttpStatus.OK,
                result: 'The properties of this book have been updated.'
            }

        }
        catch (error) {

            logger.error(error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                result: 'Unable to update this book at the moment.',
                error
            }

        }
    }

    async deleteBook (req) {

        try {

            const existingBook = await db.book.findOne({
                where: {
                    id: req.params.id,
                    deleted: { [Sequelize.Op.ne]: true }
                }
            });

            if (!existingBook) {
                return {
                    status: HttpStatus.OK,
                    result: 'The requested book is not available to be deleted.'
                }
            }

            await db.book.update({
              deleted: true
            }, {
                where: {
                    id: req.params.id
                }
            });

            return {
                status: HttpStatus.OK,
                result: 'The requested book has been marked as deleted in the library records.'
            }

        }
        catch (error) {

            logger.error(error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                result: 'Unable to delete this book at the moment.',
                error
            }
        }
    }

    async getBookAvailability (req) {
       
        const availability = await this.checkBookAvailability(req.params.id);

        if (availability === 'ERROR') {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                result: 'Unable to check availability at the moment.'
            }
        }
        else {
            return {
                status: HttpStatus.OK,
                json: { availability }
            }
        }
    }
};

const bookInstance = new Book();

export default bookInstance;