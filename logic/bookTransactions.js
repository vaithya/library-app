import Sequelize from 'sequelize';
import { db } from '../db/db.js';
import logger from '../logger.js';
import HttpStatus from 'http-status-codes';
import BookFunctions from '../logic/book.js';

class BookTransactions {

    constructor () {
        this.borrowBook = this.borrowBook.bind(this);
        this.returnBook = this.returnBook.bind(this);
        this.handleBookTransactions = this.handleBookTransactions.bind(this);
    }

    async borrowBook (req) {

        const bookId = req.params.bookId;
        const memberId = req.params.memberId;
    
        const existingMember = await db.member.findOne({
            where: {
                id: memberId,
                unRegisteredYN: { [Sequelize.Op.eq]: false }
            }
        });

        if (!existingMember) {
            return {
                status: HttpStatus.UNAUTHORIZED,
                result: `You must be a registered member to borrow this book. Please register first.`
            }
        }

        if (existingMember.amountDue > 0) {
            return {
                status: HttpStatus.FORBIDDEN,
                result: `Please pay your due amount ${existingMember.amountDue} to borrow this book.`
            }
        }
    
        const bookAvailability = await BookFunctions.checkBookAvailability(bookId);
        
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

        const bookId = req.params.bookId;
        const memberId = req.params.memberId;

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
                    status: HttpStatus.UNAUTHORIZED,
                    result: `You must be a registered member to return a book. Please register first.`
                }
            }

            if (!book) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    result: 'We did not lend you this book. Please check.'
                }
            }

            if (existingMember.noOfBooksTaken === 0) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    result: 'You\'ve returned all your books already. Please check.'
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

    async handleBookTransactions (req) {

        let transactionResult;

        if (req.body.transactionType === 'BORROW') {

            transactionResult = await this.borrowBook(req);
            return transactionResult;

        }
        else if (req.body.transactionType === 'RETURN') {

            transactionResult = await this.returnBook(req);
            return transactionResult;

        }
        else {

            return {
                status: HttpStatus.BAD_REQUEST,
                result: 'Missing or invalid transaction type. Specify either BORROW or RETURN as type. Should be a string.'
            }

        }
    }
};

const bookTransactionsInstance = new BookTransactions();

export default bookTransactionsInstance;