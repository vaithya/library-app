import validator from 'validator';

const validateName = (name) => {
    if (!name || !(typeof(name) === 'string')) {
        return 'Name of the book cannot be empty, should be a string, has to contain between 6 and 20 characters and it cannot contain special characters. ';
    }
    else if (!validator.matches(name, /[a-zA-Z0-9\s]{6,20}/i)) {
        return 'Name of the book has to contain between 6 and 20 characters and it cannot contain special characters. ';
    }
    else {
        return '';
    }
}

const validateAuthor = (author) => {
    if (!author || !(typeof(author) === 'string')) {
        return 'Author of the book cannot be empty and it should be a string. ';
    }
    else {
        return '';
    }
}

const validateShelfNumber = (shelfNumber) => {
    if (!shelfNumber || !(typeof(shelfNumber) === 'string')) {
        return 'Shelf number of the book cannot be empty and it should be a string. ';
    }
    else {
        return '';
    }
}

const validatePublishedDate = (publishedDate) => {
    if(publishedDate && !publishedDate.match(/[1,2][7,8,9,0][0-9]{2}-[0-9]{2}-[0-9]{2}/)) {
        return 'Published date of the book is not valid. ';
    }
    else {
        return '';
    }
}

const validateEdition = (edition) => {
    if (edition && !(typeof(edition) === 'string')) {
        return 'Edition number of the book is not valid. It has to be a number. ';
    }
    else {
        return '';
    }
}

export const validateBook = ({ name, author, edition, publishedDate, shelfNumber }, { operation = 'noop' }) => {

    let validationError = '';

    if (operation === 'add') {

        validationError += validateName(name);
        validationError += validateAuthor(author);
        validationError += validateShelfNumber(shelfNumber);
        validationError += validatePublishedDate(publishedDate);
        validationError += validateEdition(edition);

    }

    if (operation === 'update') {

        validationError += name !== undefined ? validateName(name) : '';
        validationError += author !== undefined ? validateAuthor(author) : '';
        validationError += shelfNumber !== undefined ? validateShelfNumber(shelfNumber) : '';
        validationError += publishedDate !== undefined ? validatePublishedDate(publishedDate) : '';
        validationError += edition !== undefined ? validateEdition(edition) : '';

    }

    if (validationError) {
        throw Error(validationError);
    }
    
}