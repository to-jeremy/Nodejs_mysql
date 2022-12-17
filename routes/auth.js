const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/connexion', authController.connexion);
router.post('/inscrire', authController.inscrire);

router.get('/deconnexion', authController.deconnexion);

module.exports = router;