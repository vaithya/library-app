import Sequelize from 'sequelize';
import logger from '../logger.js';
import bookModel from '../models/book.js';
import memberModel from '../models/member.js';

const db = {};

db.transaction = async (f, username) => {
	await db.initializeDb();
	await db.sequelize.transaction(f);
};

let initialized = false;
db.initializeDb = async () => {
	if (!initialized) {
		let connectionString = '';
		if (process.env.NODE_ENV === 'test') {
			logger.info('Connecting to test database.');
			connectionString = 'postgres://nvaithyanathan:lkas1234QQ@localhost:5432/library_test';
		}
		else {
			connectionString = 'postgres://nvaithyanathan:lkas1234QQ@localhost:5432/library';
		}

		const sequelize = new Sequelize(connectionString, {
			logging: false,
			query: {
				raw: true,
			},
		});
		db.member = memberModel(sequelize);
		db.book = bookModel(sequelize);
		db.sequelize = sequelize;
		initialized = true;
	}
};

db.syncSchema = async (force = false) => {
	try {
		const params = { force };
		await db.initializeDb();
		await db.member.sync(params);
		await db.book.sync(params);
	}
	catch (e) {
		logger.error(e);
	}
};

export { db };
