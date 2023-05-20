const mongoose = require('mongoose');
const isProd = process.env.NODE_ENV === 'production';
const isTestMode = process.env.NODE_ENV === 'prodtest';
const dbPath = isProd
  ? process.env.DB_FULL_URL
  : isTestMode
  ? process.env.DB_FULL_URL_TEST
  : process.env.LOCAL_DB;

mongoose.connect(dbPath);

mongoose.connection.on('connected', function () {
  console.log(
    'Mongoose default connection open to %s DB',
    isProd ? 'Prod' : isTestMode ? 'Test-DEV Remote' : 'Local'
  );
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
};

module.exports = mongooseStoreOpt;
