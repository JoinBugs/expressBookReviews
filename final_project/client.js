const axios = require('axios');

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

main();