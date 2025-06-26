const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username already exists
    const userExists = users.find(u => u.username === username);
  
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }
  
    // Add new user
    users.push({ username, password });
  
    return res.status(200).json({ message: "User registered successfully!" });
});

//Promise function to get books
function getBooksAsync() {
  return new Promise((resolve, reject) => {
    // Simulate async delay
    setTimeout(() => {
      resolve(books);  // resolve with data
    }, 100);
  });
}

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await getBooksAsync();
        res.status(200).json(allBooks);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching books", error: error.message });
    }
});

function getBooksISBNAsync(isbn) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found"));
        }
      }, 100);
    });
}  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    try{
        const bookDeets = await getBooksISBNAsync(isbn);
        res.status(200).json(bookDeets);
    }
    catch {
      res.status(404).json({ message: "Book with that ISBN doesn't exist!" });
    }
 });

function getBooksAuthorAsync(author) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bks = [];
  
        for (let key in books) {
          if (books[key].author === author) {
            bks.push(books[key]);
          }
        }
  
        if (bks.length > 0) {
          resolve(bks);
        } else {
          reject(new Error("No books found by that author"));
        }
      }, 100);
    });
  }  
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
    try{
        const bookDeets = await getBooksAuthorAsync(author);
        res.status(200).json(bookDeets);
    }
    catch {
      res.status(404).json({ message: "Book with that author doesn't exist!" });
    }
});

function getBooksTitleAsync(title) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bks = [];
  
        for (let key in books) {
          if (books[key].title === title) {
            bks.push(books[key]);
          }
        }
  
        if (bks.length > 0) {
          resolve(bks);
        } else {
          reject(new Error("No books with that title found"));
        }
      }, 100);
    });
  } 

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
    const title = req.params.title;
    try{
        const bookDeets = await getBooksTitleAsync(title);
        res.status(200).json(bookDeets);
    }
    catch {
      res.status(404).json({ message: "Book with that title doesn't exist!" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book && book.reviews) {
      res.send(book.reviews);
    } else {
      res.status(404).send({ message: "Book not found or no reviews available." });
    }
});

module.exports.general = public_users;
