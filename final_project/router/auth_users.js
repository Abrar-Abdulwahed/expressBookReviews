const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = "myapp"

const isValid = (username)=>{
  console.log('usersssare', users)
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{
  return users.some(user => user.username === username && user.password === password);
}

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = decoded;
    next();
  });
};

// **Task 6: registering a new user
regd_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required." });
  }

  if (users[username]) {
    return res.status(400).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  console.log('users', users)
  return res.status(200).json({ message: "User registered successfully." });
});

// **Task 7: logging in as a registered user.
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  return res.status(200).json({ message: "Login successful.", token });
});

// **Task 8: adding or modifying a book review.
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (!review) {
    return res.status(400).json({ message: "Review is required." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully.",
    reviews: books[isbn].reviews
  });
});

// **Task 9: deleting a book review under
regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user on this book." });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully.",
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
