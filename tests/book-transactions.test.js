import request from 'supertest';
import { db } from '../db/db.js';
import app from '../server/server.js';
import { populateDb } from './testdata/populateDb.js';
import Sequelize from 'sequelize';
import BookFunctions from '../logic/book.js';
import logger from '../logger.js';

beforeAll(async () => {
	const promise = new Promise((resolve, reject) => {
		app.on('serverStarted', function () {
			logger.info('Server started!');
			resolve(1);
		});
	});

	await promise;
	await populateDb();
});

test('Borrow and return a book', async () => {

	const exampleMember = await db.member.findOne({
		where: {
			unRegisteredYN: { [Sequelize.Op.ne]: true },
		},
	});

	const exampleBook = await db.book.findOne({
		where: {
			deleted: { [Sequelize.Op.ne]: true },
		},
	});

	await request(app)
		.post(`/api/members/${exampleMember.id}/books/${exampleBook.id}`)
		.send({})
		.expect(400);

	await request(app)
		.post(`/api/members/${exampleMember.id}/books/${exampleBook.id}`)
		.send({
			transactionType: 'BORROW',
		})
		.expect(200);

	let memberAfterTransaction = await db.member.findById(exampleMember.id);
	let bookAfterTransaction = await db.book.findById(exampleBook.id);

	expect(memberAfterTransaction.noOfBooksTaken).toBe(exampleMember.noOfBooksTaken + 1);
	expect(bookAfterTransaction.noOfBooksAvailable).toBe(exampleBook.noOfBooksAvailable - 1);

	await request(app)
		.post(`/api/members/${exampleMember.id}/books/${exampleBook.id}`)
		.send({
			transactionType: 'BORROW',
		})
		.expect(404)
		.expect((res) => {
			expect(res.body.result).toMatch(/This book is not available at the moment./);
		});

	await request(app)
		.post(`/api/members/0000/books/${exampleBook.id}`)
		.send({
			transactionType: 'BORROW',
		})
		.expect(401)
		.expect((res) => {
			expect(res.body.result).toMatch(/You must be a registered member to borrow this book. Please register first./);
		});

	await request(app)
		.post(`/api/members/${exampleMember.id}/books/${exampleBook.id}`)
		.send({
			transactionType: 'RETURN',
		})
		.expect(200);

	memberAfterTransaction = await db.member.findById(exampleMember.id);
	bookAfterTransaction = await db.book.findById(exampleBook.id);

	expect(memberAfterTransaction.noOfBooksTaken).toBe(exampleMember.noOfBooksTaken);
	expect(bookAfterTransaction.noOfBooksAvailable).toBe(exampleBook.noOfBooksAvailable);

	await request(app)
		.post(`/api/members/${exampleMember.id}/books/${exampleBook.id}`)
		.send({
			transactionType: 'RETURN',
		})
		.expect(400)
		.expect((res) => {
			expect(res.body.result).toMatch(/You\'ve returned all your books already. Please check./);
		});

	await request(app)
		.post(`/api/members/0000/books/${exampleBook.id}`)
		.send({
			transactionType: 'RETURN',
		})
		.expect(401)
		.expect((res) => {
			expect(res.body.result).toMatch(/You must be a registered member to return a book. Please register first./);
		});

	await request(app)
		.post(`/api/members/${exampleMember.id}/books/0000`)
		.send({
			transactionType: 'RETURN',
		})
		.expect(400)
		.expect((res) => {
			expect(res.body.result).toMatch(/We did not lend you this book. Please check./);
		});

	db.book.update = jest.fn().mockImplementationOnce(() => {
		throw new Error('Unable to update book.');
	});

	await request(app)
		.post(`/api/members/${exampleMember.id}/books/${exampleBook.id}`)
		.send({
			transactionType: 'BORROW',
		})
		.expect(500);

	await request(app)
		.post(`/api/members/${exampleMember.id}/books/${exampleBook.id}`)
		.send({
			transactionType: 'BORROW',
		})
		.expect(200);

	db.book.update = jest.fn().mockImplementationOnce(() => {
		throw new Error('Unable to update book.');
	});

	await request(app)
		.post(`/api/members/${exampleMember.id}/books/${exampleBook.id}`)
		.send({
			transactionType: 'RETURN',
		})
		.expect(500);

	await request(app)
		.post(`/api/members/${exampleMember.id}/books/${exampleBook.id}`)
		.send({
			transactionType: 'RETURN',
		})
		.expect(200);

	BookFunctions.checkBookAvailability = jest.fn().mockReturnValue(Promise.resolve('ERROR'));

	await request(app)
		.post(`/api/members/${exampleMember.id}/books/${exampleBook.id}`)
		.send({
			transactionType: 'BORROW',
		})
		.expect(500);
});


afterAll(async () => {
	await app.shutDown();
	await db.sequelize.close();
});
