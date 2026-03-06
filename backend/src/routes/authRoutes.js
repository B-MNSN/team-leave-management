const exprees = require('express');
const router = exprees.Router();

const { login } = require('../controllers/authController');

router.post('/login', login);

module.exports = router;