const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

const db = require('../model/db');
const mysql = require('mysql');

router.get('/', authController.connecter, (req, res) => {
    console.log("inside");
    console.log(req.user);
    res.render('index', {
        user: req.user
    });
});
  
router.get('/profil', authController.connecter, (req, res) => {
    console.log("inside");
    console.log(req.user);
    res.render('profil', {
        user: req.user
    });
});

router.get('/inscrire', (req, res) => {
    res.render('inscrire');
});

router.get('/connexion', (req, res) => {
    res.render('connexion');
});

router.get('/ensavoirplus', authController.connecter, (req, res) => {
    console.log("inside");
    console.log(req.user);
    res.render('ensavoirplus', {
        user: req.user
    });
});

router.get('/page_test', (req, res) => {
    res.render('erreur404');
});

router.get('/utilisateurs', (req, res) => {
    let sql = 'SELECT * FROM users';

    db.start.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.render('utilisateurs', {
                data: rows
            });
        }
    });
});




router.get('/edit/:id', (req, res) => {

    let id = req.params.id;
    console.log(id);
    let sql = 'UPDATE users SET name = ? WHERE id = ?';

    db.start.query(sql, [id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send('<h1>Nom utilisateur a changé !</h1>');
        }
    });
});

router.get('/getUsers', function (req, res) {
    let sql = 'SELECT * FROM users';
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results)
        res.send(results);
    })
});

router.get('/getUsers/:id', function (req, res) {
    let sql = 'SELECT * FROM users WHERE EmpID = ?';
    let query = db.start.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        console.log(results)
        res.send(results);
    })
});

router.get('/updateUsers/:id', function (req, res) {
    let sql = 'UPDATE users SET Name = ? WHERE EmpID = ?';
    let newName = 'Jerem';
    let query = db.start.query(sql, [newName, req.params.id], (err, results) => {
        if (err) throw err;
        console.log(results)
        res.send('Username updated');
    })
});

router.get('/deleteUsers/:id', function (req, res) {
    let sql = 'DELETE from users WHERE EmpID = ?';

    let query = db.start.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        console.log(results)
        res.send(`User ID ${req.params.id} deleted`);
    })
});

module.exports = router;