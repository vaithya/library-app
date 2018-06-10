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

test('Register a member', async () => {

	await request(app)
		.post('/api/members')
		.send({
			username: 'testuser1',
		})
		.expect(201);

	const createdMember = await db.member.findOne({
		where: {
			username: 'testuser1',
		},
	});

	expect(createdMember.username).toBe('testuser1');

	await request(app)
		.post('/api/members')
		.send({})
		.expect(422)
		.expect((res) => {
			expect(res.body.error).toMatch(/Username cannot be empty and it should be a string, should be between 6-12 characters\/digits. Cannot contain special characters. /);
		});

	await request(app)
		.post('/api/members')
		.send({
			username: 123,
		})
		.expect(422)
		.expect((res) => {
			expect(res.body.error).toMatch(/Username cannot be empty and it should be a string, should be between 6-12 characters\/digits. Cannot contain special characters. /);
		});

	await request(app)
		.post('/api/members')
		.send({
			username: '',
		})
		.expect(422)
		.expect((res) => {
			expect(res.body.error).toMatch(/Username cannot be empty and it should be a string, should be between 6-12 characters\/digits. Cannot contain special characters. /);
		});

	await request(app)
		.post('/api/members')
		.send({
			username: 'abc',
		})
		.expect(422)
		.expect((res) => {
			expect(res.body.error).toMatch(/Username should be between 6-12 characters\/digits. Cannot contain special characters. /);
		});

	await request(app)
		.post('/api/members')
		.send({
			username: 'abcdef',
			contactNumber: 123,
		})
		.expect(422)
		.expect((res) => {
			expect(res.body.error).toMatch(/Contact number should be a string. /);
		});

	await request(app)
		.post('/api/members')
		.send({
			username: 'abcdef',
			contactNumber: '123a',
		})
		.expect(422)
		.expect((res) => {
			expect(res.body.error).toMatch(/Contact number can contain only numbers. /);
		});

	await request(app)
		.post('/api/members')
		.send({
			username: 'abcdef',
			contactNumber: '123',
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.result).toMatch(/The requested user is already a registered member./);
		});

	db.member.create = jest.fn().mockImplementationOnce(() => {
		throw new Error('Unable to fetch data from db.');
	});

	await request(app)
		.post('/api/members')
		.send({
			username: 'abcdefgh',
			contactNumber: '123',
		})
		.expect(500)
		.expect((res) => {
			expect(res.body.error).toMatch(/Unable to fetch data from db./);
		});

});

test('Unregister a member', async () => {

	const exampleMember = await db.member.findOne({
		where: {
			unRegisteredYN: { [Sequelize.Op.ne]: true },
		},
	});

	await request(app)
		.delete(`/api/members/${exampleMember.id}`)
		.expect(200);

	const deletedMember = await db.member.findOne({
		where: {
			id: exampleMember.id,
		},
	});

	expect(deletedMember.unRegisteredYN).toBe(true);

	await request(app)
		.delete(`/api/members/${deletedMember.id}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.result).toMatch(/This user has already unregistered with us./);
		});

	await request(app)
		.delete(`/api/members/99999`)
		.expect(400);

	await request(app)
		.post('/api/members')
		.send({
			username: 'testuser10',
		})
		.expect(201);

	const createdMember = await db.member.findOne({
		where: {
			username: 'testuser1',
		},
	});

	db.member.update = jest.fn().mockImplementation(() => {
		throw Error('Unable to update database.');
	});

	await request(app)
		.delete(`/api/members/${createdMember.id}`)
		.expect(500);
});

afterAll(async () => {
	await app.shutDown();
	await db.sequelize.close();
});
