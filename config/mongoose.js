const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://ratandubeysomesh:RD6cRwWneFfAgA0r@friendbook-cluster-prod.kdjcvzz.mongodb.net/test");

const db = mongoose.connection;

db.on('error', console.error.bind(console, "connection error"));

db.once('open', () => {
    console.log("Database is connected successfully");
});



module.exports = db;
//development-db-url="mongodb://localhost/friend-book-db";
//production-db-url="mongodb+srv://ratandubeysomesh:RD6cRwWneFfAgA0r@friendbook-cluster-prod.kdjcvzz.mongodb.net/test"
