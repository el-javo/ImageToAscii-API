const mongoose = require('mongoose');

const connectDB = (url) => {
  console.log('connecting to db...');
  return mongoose.connect(url);
};

module.exports = connectDB;
