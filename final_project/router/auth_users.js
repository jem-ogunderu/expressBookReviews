const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.find(u => u.username === username && u.password === password)
}

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required." });
    }
  
    const user = authenticatedUser(username, password);
  
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
  
    const accessToken = jwt.sign(
      { username }, 
      'accessToken', 
      { expiresIn: '1h' }
    );
  
    req.session.authorization = { accessToken, username };
  
    return res.status(200).json({ message: "Login successful."});
});
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session?.authorization?.username;
  
    if (!username) {
      return res.status(401).json({ message: "Unauthorized: You must be logged in." });
    }
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (!review) {
      return res.status(400).json({ message: "No review provided." });
    }
  
    // Add or update review under this user's name
    book.reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added or updated successfully.",
      reviews: book.reviews
    });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
