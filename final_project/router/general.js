const express = require('express');
const axios = require('axios');
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

const instance = axios.create({
    baseURL: 'https://cornejocruza-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/',
});

function getBooks() {
    return instance.get('/')
        .then(function (response) {
        console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
    });
}

function getBookDetails(isbn) {
    return instance.get(`/isbn/${isbn}`)
        .then(function (response) {
        console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
        });
} 

function getBookByAuthor(author) {
    return instance.get(`/author/${author}`)
        .then(function (response) {
        console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
        });
}

function getBookByTitle(title) {
    return instance.get(`/title/${title}`)
        .then(function (response) {
        console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
        });
} 

function main() {
    console.log('\n\nall books');
    getBooks().then(() => {
        console.log('\n\nbook detail');
        getBookDetails('978-1-60309-502-1').then(() =>{
            console.log('\n\nbook by Author Dante Alighieri');
            getBookByAuthor('Dante Alighieri').then(() => {
                console.log('\n\nbook by title Molloy, Malone Dies, The Unnamable, the trilogy');
                getBookByTitle('Molloy, Malone Dies, The Unnamable, the trilogy');
            })
        })
    })
}

//main();

module.exports.general = public_users;
