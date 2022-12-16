const path = require('path');
require('dotenv').config();
const express = require('express');

const indexRouter = require('./routes/index');
const groupsRouter = require('./routes/groups');
const schemasRouter = require('./routes/schemas');
const teachersRouter = require('./routes/teachers');
const studentsRouter = require('./routes/students');
const { addMiddlewares, addErrorHandlers } = require('./middlewares/add-middlewares');
const { PORT } = require('./config/constants');

const app = express();
app.use(express.static(path.resolve('client', 'build')));

addMiddlewares(app);

app.use('/api', indexRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/schemas', schemasRouter);
app.use('/api/teachersandtime', teachersRouter);
app.use('/api/students', studentsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('client', 'build', 'index.html'));
});

addErrorHandlers(app);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
