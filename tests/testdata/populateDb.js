import { db } from '../../db/db.js';

export const members = [
	{
		username: 'abcdef',
	},
	{
		username: 'qwertymnop',
	},
];

export const books = [
	{
		name: 'book11',
		author: 'vaithy',
		edition: '5',
		shelfNumber: '5',
		publishedDate: '2017-12-02',
		noOfBooksAvailable: 1,
	},
	{
		name: 'book22',
		author: 'vaithy',
		edition: '5',
		shelfNumber: '5',
		publishedDate: '2017-12-02',
		noOfBooksAvailable: 1,
	},
];

export const populateDb = async () => {

	await db.syncSchema();

	await db.member.destroy({
		where: {},
		truncate: true,
	});

	await db.book.destroy({
		where: {},
		truncate: true,
	});

	await db.member.create(members[0]);
	await db.member.create(members[1]);
	await db.book.create(books[0]);
	await db.book.create(books[1]);

};
