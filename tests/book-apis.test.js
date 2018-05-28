import request from 'supertest';
import { db } from '../db/db.js';
import app from '../server/server.js';
import { members, books, populateDb } from './testdata/populateDb.js';
import Sequelize from 'sequelize';

beforeAll(async () => {
    await populateDb();
});

test('Add a book to the library, Book parameters validation', async () => {

    await request(app)
        .post('/api/books')
        .send({
            "name": "Book 56",
            "author": "vaithy",
            "edition": "5",
            "shelfNumber": "5",
            "publishedDate": "12/02/2018"
        })
        .expect(201);

    const createdBook = await db.book.findOne({
        where: {
            name: 'Book 56'
        }
    });

    expect(createdBook.name).toBe('Book 56');

    await request(app)
        .post('/api/books')
        .send({
            "name": "Book 56",
            "author": "vaithy",
            "edition": "5",
            "shelfNumber": "5",
            "publishedDate": "12/02/2018"
        })
        .expect(201);

    const addedBook = await db.book.findOne({
        where: {
            name: 'Book 56'
        }
    });
    
    expect(addedBook.noOfBooksAvailable).toBe(2);

    db.book.update = jest.fn().mockImplementationOnce(() => {
        throw new Error('Test Error');
    });

    await request(app)
        .post('/api/books')
        .send({
            "name": "Book 56",
            "author": "vaithy",
            "edition": "5",
            "shelfNumber": "5",
            "publishedDate": "12/02/2018"
        })
        .expect(500)
        .expect((res) => {
            expect(res.body.error).toMatch(/Test Error/);
        })

    await request(app)
        .post('/api/books')
        .send({
            "author": "vaithy",
            "edition": "5",
            "shelfNumber": "5",
            "publishedDate": "12/02/2018"
        })
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toMatch(/Name of the book cannot be empty and should be a string./);
        })

    await request(app)
        .post('/api/books')
        .send({
            "name": 123,
            "author": 123,
            "edition": "5",
            "shelfNumber": "5",
            "publishedDate": "12/02/2018"
        })
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toMatch(/Name of the book cannot be empty and should be a string./);
        })

    await request(app)
        .post('/api/books')
        .send({
            "name": "new book",
            "author": 123,
            "edition": "5",
            "shelfNumber": "5",
            "publishedDate": "12/02/2018"
        })
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toMatch(/Author of the book cannot be empty and should be a string./);
        })

    await request(app)
        .post('/api/books')
        .send({
            "name": "new book",
            "edition": "5",
            "shelfNumber": "5",
            "publishedDate": "12/02/2018"
        })
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toMatch(/Author of the book cannot be empty and should be a string./);
        })

    await request(app)
        .post('/api/books')
        .send({
            "name": "new book",
            "author": "vaithy",
            "edition": "5",
            "publishedDate": "12/02/2018"
        })
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toMatch(/Shelf number of the book cannot be empty and should be a string./);
        })

    await request(app)
        .post('/api/books')
        .send({
            "name": "new book",
            "author": "vaithy",
            "edition": "5",
            "publishedDate": "12/02/2018",
            "shelfNumber": 5
        })
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toMatch(/Shelf number of the book cannot be empty and should be a string./);
        })

    await request(app)
        .post('/api/books')
        .send({
            "name": "new",
            "author": "vaithy",
            "edition": "5",
            "publishedDate": "12/02/2018",
            "shelfNumber": "5"
        })
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toMatch(/Name of the book has to contain between 6 and 20 characters and it cannot contain special characters./);
        })

    await request(app)
        .post('/api/books')
        .send({
            "name": "new book",
            "author": "vaithy",
            "edition": "5",
            "publishedDate": "12",
            "shelfNumber": "5"
        })
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toMatch(/Published date of the book is not valid./);
        })

    await request(app)
        .post('/api/books')
        .send({
            "name": "new book",
            "author": "vaithy",
            "edition": 5,
            "publishedDate": "12/02/2018",
            "shelfNumber": "5"
        })
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toMatch(/Edition number of the book is not valid. It has to be a number./);
        })
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
            deleted: { [Sequelize.Op.ne]: true }
        }
    });

    await request(app)
            .get(`/api/books/${bookToGet.id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toBe(bookToGet.id);
            });

    await request(app)
            .get(`/api/books/9999`)
            .expect(200)
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
