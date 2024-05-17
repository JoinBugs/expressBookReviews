const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const exist = (username, password) =>
        users.filter(user => user.username === username && 
            (!password || user.password === password)).length > 0

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (exist(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

function getIBookReview(isbn, user) {
    let i_book = -1,
        i_review = -1;
    for(let i = 0; i < books.length; i++) {
        if(books[i].isbn === isbn) {
            i_book = i;
            for(let j = 0; j < books[i].reviews.length; j++) {
                if(books[i].reviews[j].user === user) {
                    i_review = j;
                    break;
                }
            }
        }
    }
    return {i_book, i_review};
}

regd_users.post('/auth/review/:isbn/:review', function (req, res) {
    const currentUser = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.params.review;

    let { i_book, i_review } = getIBookReview(isbn, currentUser);
    if(i_review === -1) {
        books[i_book].reviews.push({"user": currentUser, "review": review}); 
        return res.send("review added");    
    }
    books[i_book].reviews[i_review].review = review;
    return res.send("review updated");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const currentUser = req.session.authorization.username;
    const isbn = req.params.isbn;

    let { i_book, i_review } = getIBookReview(isbn, currentUser);
    if(i_book === -1) {
        return res.send("isbn not exists");
    }
    if(i_review !== -1) {
        books[i_book].reviews.splice(i_review, 1);
        return res.send("review deleted");
    }
    return res.send("the user cannot delete reviews from others")
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.exist = exist;
module.exports.users = users;
