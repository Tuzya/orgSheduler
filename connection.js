const mongoose = require('mongoose');
const isProd = process.env.NODE_ENV === 'production';
const dbPath = isProd ? process.env.DB_FULL_URL : process.env.LOCAL_DB;

mongoose.connect(dbPath);

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to %s DB', isProd ? 'Prod' : 'Local');
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

const mongooseStoreOpt = {
  mongoUrl: dbPath
}

module.exports = mongooseStoreOpt;
