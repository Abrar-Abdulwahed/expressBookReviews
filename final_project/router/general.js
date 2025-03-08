const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required." });
  }

  if (users[username]) {
    return res.status(400).json({ message: "Username already exists." });
  }

  users[username] = { password };
  return res.status(200).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const allBooks = Object.values(books);
  return res.status(200).json(allBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }
  
  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
  
  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "No books found by this author." });
  }

  return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "No books found with this title." });
  }

  return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  return res.status(200).json(book.reviews);
});

// Async
// **Task 10: Get all books using async/await & Axios**
public_users.get('/async/books', async (req, res) => {
  try {
      const response = await axios.get(`${BASE_URL}/`);
      return res.status(200).json(response.data);
  } catch (error) {
      return res.status(500).json({ message: "Error fetching books list." });
  }
});

// **Task 11: Get book details by ISBN using async/await & Axios**
public_users.get('/async/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
      const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
      return res.status(200).json(response.data);
  } catch (error) {
      return res.status(404).json({ message: "Book not found." });
  }
});

// **Task 12: Get book details by Author using async/await & Axios**
public_users.get('/async/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
      const response = await axios.get(`${BASE_URL}/author/${author}`);
      return res.status(200).json(response.data);
  } catch (error) {
      return res.status(404).json({ message: "No books found by this author." });
  }
});

// **Task 13: Get book details by Title using async/await & Axios**
public_users.get('/async/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
      const response = await axios.get(`${BASE_URL}/title/${title}`);
      return res.status(200).json(response.data);
  } catch (error) {
      return res.status(404).json({ message: "No books found with this title." });
  }
})

module.exports.general = public_users;
