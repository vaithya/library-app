import validator from 'validator';

export const validateMember = (username, contactNumber) => {

    if(username === '' || typeof(username) === 'number') {
        throw new Error('Username cannot be empty and it should be a string containing atleast one character.')
    }

    if (!validator.matches(username, /[a-zA-Z0-9\s]{6,12}/i)) {
        throw new Error('Username should be between 6-12 characters/digits. Cannot contain special characters. Should be a string.');
    }

    if (typeof(contactNumber) === 'number') {
        throw new Error('Contact number should be a string.');
    }

    if (contactNumber && !validator.isNumeric(contactNumber)) {
        throw new Error('Contact number can contain only numbers.')
    }

}

export const validateBook = (name, author, edition, publishedDate, shelfNumber) => {

    if (!(typeof(name) === 'string') || name === '') {
        throw new Error('Name of the book cannot be empty and should be a string.');
    }
   
    if (!(typeof(author) === 'string') || author === '') {
        throw new Error('Author of the book cannot be empty and should be a string.');
    }

    if (!(typeof(shelfNumber) === 'string') || shelfNumber === '') {
        throw new Error('Shelf number of the book cannot be empty and should be a string.');
    }

    if (!validator.matches(name, /[a-zA-Z0-9\s]{6,20}/i)) {
        throw new Error('Name of the book has to contain between 6 and 20 characters and it cannot contain special characters.');
    }

    if(publishedDate && !publishedDate.match(/[0-9]{2}\/[0-9]{2}\/[1,2][7,8,9,0][0-9]{2}/)) {
        throw new Error('Published date of the book is not valid.');
    }

    if (edition && !(typeof(edition) === 'string')) {
        throw new Error('Edition number of the book is not valid. It has to be a number.');
    }
}