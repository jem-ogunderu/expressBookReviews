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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bks = books;
  res.send(bks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (books[book].author === author){
        bks.push(books[book]);
    }
    else{
        res.status(404).send({ message: ("Book with that isbn doesn't exist!")});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bks =[];

  for (let book in books){
        if (books[book].author === author){
            bks.push(books[book]);
        }
        else{
            res.status(404).send({ message: ("Book with that author doesn't exist!")});
        }
  }
  res.send(bks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bks =[];
  
    for (let book in books){
          if (books[book].title === title){
              bks.push(books[book]);
          }
          else{
            res.status(404).send({ message: ("Book with that title doesn't exist!")});
          }
    }
    res.send(bks);
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
