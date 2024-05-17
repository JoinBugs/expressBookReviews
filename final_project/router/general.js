const express = require('express');
let books = require("./booksdb.js");
let exist = require("./auth_users.js").exist;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!exist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json(books);
  //return res.send(JSON.stringify(books, null, 4))
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code her
  const isbn = req.params.isbn;
  return res.send(books.find(e => e.isbn === isbn))
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  return res.send(books.find(e => e.author === author))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  return res.send(books.find(e => e.title === title))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.json(books.find(e => e.isbn === isbn).reviews)
});

public_users.post('/review/:isbn/:review', function (req, res) {
    const currentUser = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.params.review;

    let i_book = -1,
        i_review = -1;
    for(let i = 0; i < books.length; i++) {
        if(books[i].isbn === isbn) {
            i_book = i;
            for(let j = 0; j < books[i].reviews.length; j++) {
                if(books[i].reviews[j].user === currentUser) {
                    i_review = j;
                    break;
                }
            }
        }
    }
    if(i_review === -1) {
        books[i_book].reviews.push({"user": currentUser, "review": review}); 
        return res.send("review added");    
    }
    books[i_book].reviews[i_review].review = review;
    return res.send("review updated");
});


module.exports.general = public_users;
