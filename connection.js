const mongoose = require('mongoose');

// const env = process.env.NODE_ENV || 'development';
// const db = process.env.DB_FULL_URL || require('./config/config.json')[env].db;
const db = process.env.DB_FULL_URL;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + db);
});
// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


module.exports = mongoose.connection;
