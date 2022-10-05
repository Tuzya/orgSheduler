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
Group.create(groups)
  .then((res) => {
    console.log(res);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Seeds failed', err.message);
    mongoose.disconnect();
  });
