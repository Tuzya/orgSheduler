const express = require('express');
const { checkAuth, isAdmin } = require('../middlewares/check-auth');
const { allSchemas, schemas, updSchemas } = require('../controllers/schemas');

const router = express.Router();

router.get('/', allSchemas);

router.get('/:phase', schemas);

router.put('/:phase', checkAuth, updSchemas);

module.exports = router;
