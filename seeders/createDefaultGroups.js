const mongoose = require('mongoose');
require('dotenv').config();
require('../connection');
const Group = require('../models/Group');

const groups = [
  new Group({
    name: 'WaitList',
    groupType: 'waitlist'
  }),
  new Group({
    name: 'Inactive',
    groupType: 'inactive'
  })
];
mongoose.connection.on('connected', function () {
  Group.create(groups)
    .then((res) => {
      console.log('Created:', res);
      mongoose.disconnect();
    })
    .catch((err) => {
      console.error('Seeds failed', err.message);
      mongoose.disconnect();
    });
});

