const path = require('path');
require('dotenv').config();
const express = require('express');

const indexRouter = require('./routes/index');
const groupsRouter = require('./routes/groups');
const schemasRouter = require('./routes/schemas');
const { addMiddlewares, addErrorHandlers } = require('./middlewares/add-middlewares');
const { PORT } = require('./config/constants');

const app = express();
app.use(express.static(path.join(__dirname, 'client', 'build')));

addMiddlewares(app);


app.use('/api', indexRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/schemas', schemasRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

addErrorHandlers(app);

app.listen(
  PORT,
  () => console.log(`Express server started on port: ${PORT}`),
);
