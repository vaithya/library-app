import Sequelize from 'sequelize';

export default (sequelizeInstance) => sequelizeInstance.define('member', {
	username: {
		field: 'username',
		type: Sequelize.STRING(20),
		notNull: true,
	},
	noOfBooksTaken: {
		field: 'noofbookstaken',
		type: Sequelize.INTEGER,
		notNull: true,
		defaultValue: 0,
	},
	contactNumber: {
		field: 'contactnumber',
		type: Sequelize.STRING(10),
	},
	amountDue: {
		field: 'amountdue',
		type: Sequelize.FLOAT,
		notNull: true,
		defaultValue: 0,
	},
	joinedOn: {
		field: 'joinedon',
		type: Sequelize.DATE,
		notNull: true,
		defaultValue: function () {
			const date = new Date();
			return date.getDate();
		},
	},
	unRegisteredYN: {
		field: 'unregisteredyn',
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
});

