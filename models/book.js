import Sequelize from 'sequelize';
import member from './member.js';

export default (sequelizeInstance) => sequelizeInstance.define('book', {
    name: {
        field: 'name',
        type: Sequelize.STRING(20),
        notNull: true
    },
    author: {
        field: 'author',
        type: Sequelize.STRING(20),
        notNull: true
    },
    publishedDate: {
        field: 'publisheddate',
        type: Sequelize.DATE
    },
    edition: {
        field: 'edition',
        type: Sequelize.STRING(2)
    },
    shelfNumber: {
        field: 'shelfnumber',
        type: Sequelize.STRING(2),
        notNull: true
    },
    deleted: {
        field: 'deleted',
        type: Sequelize.BOOLEAN,
        notNull: true,
        defaultValue: false
    },
    noOfBooksAvailable: {
        field: 'noofbooksavailable',
        type: Sequelize.INTEGER,
        notNull: true
    }
});

