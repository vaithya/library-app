import request from 'supertest';
import { db } from '../db/db.js';
import app from '../server/server.js';
import { populateDb } from './testdata/populateDb.js';
import Sequelize from 'sequelize';
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

test('Add a book to the library, Book parameters validation', async (done) => {

	await request(app)
		.post('/api/books')
		.send({
			name: 'Book 56',
			author: 'vaithy',
			edition: '5',
			shelfNumber: '5',
			publishedDate: '2018-12-02',
		})
		.expect(201);

	const createdBook = await db.book.findOne({
		where: {
			name: 'Book 56',
		},
	});

	expect(createdBook.name).toBe('Book 56');

	await request(app)
		.post('/api/books')
		.send({
			name: 'Book 56',
			author: 'vaithy',
			edition: '5',
			shelfNumber: '5',
			publishedDate: '2018-12-02',
		})
		.expect(201);

	const addedBook = await db.book.findOne({
		where: {
			name: 'Book 56',
		},
	});

	expect(addedBook.noOfBooksAvailable).toBe(2);

	await request(app)
		.post('/api/books')
		.send({
			author: 'vaithy',
			edition: '5',
			shelfNumber: '5',
			publishedDate: '2018-12-02',
		})
		.expect(400)
		.expect((res) => {
			expect(res.body.error).toMatch(/Name of the book cannot be empty, should be a string/);
		});

	await request(app)
		.post('/api/books')
		.send({
			name: 123,
			edition: '5',
			shelfNumber: '5',
			publishedDate: '2018-12-02',
		})
		.expect(400)
		.expect((res) => {
			expect(res.body.error).toMatch(/Name of the book cannot be empty, should be a string, has to contain between 6 and 20 characters and it cannot contain special characters. Author of the book cannot be empty and it should be a string. /);
			expect(res.body.error).toMatch(/Author of the book cannot be empty and it should be a string. /);
		});

	await request(app)
		.post('/api/books')
		.send({
			name: 'abc',
			author: 123,
			edition: '5',
			shelfNumber: '5',
			publishedDate: '2018-12-02',
		})
		.expect(400)
		.expect((res) => {
			expect(res.body.error).toMatch(/Name of the book has to contain between 6 and 20 characters and it cannot contain special characters. /);
			expect(res.body.error).toMatch(/Author of the book cannot be empty and it should be a string. /);
		});

	await request(app)
		.post('/api/books')
		.send({
			name: 'new book',
			author: 'abc',
		})
		.expect(400)
		.expect((res) => {
			expect(res.body.error).toMatch(/Shelf number of the book cannot be empty and it should be a string. /);
		});

	await request(app)
		.post('/api/books')
		.send({
			name: 'new book',
			edition: 5,
			shelfNumber: 5,
			publishedDate: '2018-12-02',
		})
		.expect(400)
		.expect((res) => {
			expect(res.body.error).toMatch(/Shelf number of the book cannot be empty and it should be a string. /);
			expect(res.body.error).toMatch(/Edition number of the book is not valid. It has to be a number. /);
		});

	await request(app)
		.post('/api/books')
		.send({
			name: 'new book',
			author: 'vaithy',
			edition: '5',
			publishedDate: '2018-12',
		})
		.expect(400)
		.expect((res) => {
			expect(res.body.error).toMatch(/Published date of the book is not valid. /);
		});
	done();
});

test('Get book APIs', async () => {

	await request(app)
		.get('/api/books')
		.expect(200)
		.expect((res) => {
			expect(res.body.length).toBe(3);
		});

	const bookToGet = await db.book.findOne({
		where: {
			deleted: { [Sequelize.Op.ne]: true },
		},
	});

	await request(app)
		.get(`/api/books/${bookToGet.id}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.id).toBe(bookToGet.id);
		});

	await request(app)
		.get(`/api/books/9999`)
		.expect(404)
		.expect((res) => {
			expect(res.body.result).toMatch(/The requested book is not available now./);
		});

	await request(app)
		.get(`/api/books/availability/9999`)
		.expect(200)
		.expect((res) => {
			expect(res.body.availability).toBe(false);
		});

	await request(app)
		.get(`/api/books/availability/${bookToGet.id}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.availability).toBe(true);
		});
});

test('Update book properties API', async () => {

	const bookToUpdate = await db.book.findOne({
		where: {
			deleted: { [Sequelize.Op.ne]: true },
		},
	});

	await request(app)
		.patch(`/api/books/${bookToUpdate.id}`)
		.send({})
		.expect(400);

	await request(app)
		.patch(`/api/books/${bookToUpdate.id}`)
		.send({
			name: 'book 11',
		})
		.expect(200);

	await request(app)
		.patch(`/api/books/${bookToUpdate.id}`)
		.send({
			edition: '2',
		})
		.expect(200);

	await request(app)
		.patch(`/api/books/${bookToUpdate.id}`)
		.send({
			author: 'vaithy',
			shelfNumber: '2',
			publishedDate: '2018-12-02',
			unknownKey: 'test',
		})
		.expect(200);

	const updatedBook = await db.book.findById(bookToUpdate.id);

	expect(updatedBook).toEqual(expect.objectContaining({
		name: 'book 11',
		author: 'vaithy',
		shelfNumber: '2',
		edition: '2',
	}));

	await request(app)
		.patch(`/api/books/0000`)
		.send({
			edition: '2',
		})
		.expect(404)
		.expect((res) => {
			expect(res.body.result).toMatch(/The requested book is not available to be updated./);
		});

});

test('Delete a book', async () => {
	const bookToDelete = await db.book.findOne({
		where: {
			deleted: { [Sequelize.Op.ne]: true },
		},
	});

	await request(app)
		.delete(`/api/books/${bookToDelete.id}`)
		.expect(200);

	const deletedBook = await db.book.findById(bookToDelete.id);

	expect(deletedBook.deleted).toBe(true);

	await request(app)
		.delete(`/api/books/0000`)
		.expect(404)
		.expect((res) => {
			expect(res.body.result).toMatch(/The requested book is not available to be deleted./);
		});
});


test('Error scenarios for all book APIs', async () => {

	const book = await db.book.findOne({
		where: {
			deleted: { [Sequelize.Op.ne]: true },
		},
	});

	db.book.update = jest.fn().mockImplementation(() => {
		throw new Error('Unable to update database.');
	});

	db.book.findAll = jest.fn().mockImplementation(() => {
		throw new Error('Unable to update database.');
	});

	db.book.findOne = jest.fn().mockImplementation(() => {
		throw new Error('Unable to update database.');
	});

	await request(app)
		.post('/api/books')
		.send({
			name: 'Book 56',
			author: 'vaithy',
			edition: '5',
			shelfNumber: '5',
			publishedDate: '2018-12-02',
		})
		.expect(500)
		.expect((res) => {
			expect(res.body.error).toMatch(/Unable to update database./);
		});

	await request(app)
		.get('/api/books')
		.expect(500);

	await request(app)
		.get(`/api/books/${book.id}`)
		.expect(500);

	await request(app)
		.get(`/api/books/availability/${book.id}`)
		.expect(500);

	await request(app)
		.patch(`/api/books/${book.id}`)
		.send({
			edition: '2',
		})
		.expect(500);

	await request(app)
		.delete(`/api/books/${book.id}`)
		.expect(500);
});

afterAll(async () => {
	await app.shutDown();
	await db.sequelize.close();
});
