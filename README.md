<pre style='background-color:white'>
Technical Upskilling (Node.js & REST)
-------------------------------------

Objective of This Project:

To build a book management application with APIs to achieve the following:

- Add book
- List all books
- Display book for a given book id
- Delete a book
- Edit properties of a book
- Register a member 
- Unregister a member
- Borrow a book
- Return a book
- Check availability of a book



Libraries & Frameworks Used:


1.  Express.js

    A web framework for Node.js used to assign handlers for requests, define routes & add middlewares.

2.  Sequelize

    A promise based ORM for postgres database. Wrapper around postgres operations.

3.  Validator

    A library of string validators.

4.  Jest

    A unit testing framework.

5.  Istanbul

    A tool used to find the code coverage of our application. 

6.  Eslint

    A tool for reporting and fixing styling, errors and enforcing coding standards.

7.  Webpack

    A module bundler

8.  Babel

    A java script transpiler that converts ES6 and above into ES5 that can run in any browser.

9.  Supertest

    A library for testing http servers.

11. Http-Status-Codes

    A library of constants that provide a user-readable way of returning status codes.

12. Swagger

    API documentation



API Documentation: 

1. Clone the git repository.
2. Run 'npm install'.
3. Run 'npm run start:dev'.
4. From the browser, go to 'localhost:8080/api-docs'.



Unit Test Report: 

 PASS  tests/book-apis.test.js
  ✓ Add a book to the library, Book parameters validation (75ms)
  ✓ Get book APIs (21ms)
  ✓ Update book properties API (28ms)
  ✓ Delete a book (12ms)
  ✓ Error scenarios for all book APIs (15ms)
	
 PASS  tests/book-transactions.test.js
  ✓ Borrow and return a book (97ms)

 PASS  tests/member-apis.test.js
  ✓ Register a member (35ms)
  ✓ Unregister a member (28ms)

Test Suites: 3 passed, 3 total
Tests:       8 passed, 8 total



Code Coverage: 

1. Clone the git repository.
2. Run 'npm install'.
3. Run 'npm run test' or 'npm run coverage'.

--------------------------------|----------|----------|----------|----------|-------------------|
File                            |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
--------------------------------|----------|----------|----------|----------|-------------------|
All files                       |    91.55 |    82.87 |    91.45 |    98.67 |                   |
 library-app                    |      100 |      100 |      100 |      100 |                   |
  logger.js                     |      100 |      100 |      100 |      100 |                   |
 library-app/constants          |      100 |      100 |      100 |      100 |                   |
  bookProperties.js             |      100 |      100 |      100 |      100 |                   |
  validationMessages.js         |      100 |      100 |      100 |      100 |                   |
 library-app/controllers        |      100 |      100 |      100 |      100 |                   |
  bookController.js             |      100 |      100 |      100 |      100 |                   |
  bookTransactionsController.js |      100 |      100 |      100 |      100 |                   |
  memberController.js           |      100 |      100 |      100 |      100 |                   |
 library-app/db                 |    80.88 |    68.18 |    71.43 |    92.59 |                   |
  db.js                         |    80.88 |    68.18 |    71.43 |    92.59 |              9,22 |
 library-app/logic              |    90.04 |     78.9 |    93.18 |      100 |                   |
  book.js                       |    88.17 |    76.15 |    95.24 |      100 |... 01,210,270,317 |
  bookTransactions.js           |    91.76 |    83.08 |       96 |      100 |     1,6,16,96,172 |
  member.js                     |    92.04 |    79.55 |    85.71 |      100 |         1,6,10,71 |
 library-app/middleware         |    95.92 |    92.86 |      100 |      100 |                   |
  handlers.js                   |    95.92 |    92.86 |      100 |      100 |                20 |
 library-app/models             |      100 |      100 |      100 |      100 |                   |
  book.js                       |      100 |      100 |      100 |      100 |                   |
  member.js                     |      100 |      100 |      100 |      100 |                   |
 library-app/server             |    93.02 |      100 |    71.43 |    92.11 |                   |
  server.js                     |    93.02 |      100 |    71.43 |    92.11 |          56,57,61 |
 library-app/tests/testdata     |    92.68 |      100 |       90 |      100 |                   |
  populateDb.js                 |    92.68 |      100 |       90 |      100 |                   |
 library-app/validators         |      100 |    98.21 |      100 |      100 |                   |
  bookValidator.js              |      100 |     97.5 |      100 |      100 |                51 |
  commonValidator.js            |      100 |      100 |      100 |      100 |                   |
  memberValidator.js            |      100 |      100 |      100 |      100 |                   |
--------------------------------|----------|----------|----------|----------|-------------------|


<a href="https://athenaconfluence.athenahealth.com/display/~nvaithyanathan/Technical+Upskilling">My Confluence Page</a>

</pre>
