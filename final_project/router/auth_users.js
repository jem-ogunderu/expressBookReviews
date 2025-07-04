const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    const userExists = users.find(user => user.username === username);
    return !userExists;
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.find(u => u.username === username && u.password === password)
}

regd_users.post("/login", (req, res) => {
    
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
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

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;
  
    if (!username) {
      return res.status(401).json({ message: "Unauthorized: You must be logged in." });
    }
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json(
        { 
            message: "Book review deleted successfully.",
            reviews: book.reviews
        });
    } else {
      return res.status(404).json({ message: "Review not found for this user." });
    }
});
  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
