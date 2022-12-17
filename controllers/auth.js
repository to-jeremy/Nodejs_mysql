const db = require('../model/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');


exports.connexion = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render("connexion", {
            message: 'Veillez fournir un email et un mot de passe !'
        });
    }

    db.start.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        console.log(results);
        console.log(password);
        const isMatch = await bcrypt.compare(password, results[0].password);
        console.log(isMatch);
        if(!results || !isMatch) {
            return res.status(401).render("connexion", {
                message: 'Le mail et le mot de passe sont incorrectes !'
            });
        } else {
            const id = results[0].id;
            console.log(id);
            const token = jwt.sign({ id }, process.env.JWT_KEY, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
    
            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            };
            res.cookie('jwt', token, cookieOptions);
    
            res.status(200).redirect("/");
            }
        });
    };

exports.inscrire = (req, res) => {
    console.log(req.body);

    const { genre, nom, prenom, email, tel, password, passwordConfirm } = req.body;

    if (!nom || !email || !password || !passwordConfirm) {
        return res.status(401).render("inscrire", {
            message: 'Veillez fournir les informations demandées !'
        });
    }

    db.start.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if( results.length > 0 ) {
            return res.render('inscrire', {
                message: 'Email est déjà utilisé !'
            });
        } else if( password !== passwordConfirm ) {
            return res.render('inscrire', {
                message: 'Le mot de passe est pas bon !'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.start.query('INSERT INTO users SET ?', {genre: genre, nom: nom, prenom: prenom, email: email, tel: tel, password: hashedPassword}, (error, results) => {
            if(error) {
                console.log(error);
            } else {
                db.start.query('SELECT id FROM users WHERE email = ?', [email], (error, result) => {
                    const id = result[0].id;
                    console.log(id);
                    const token = jwt.sign({ id }, process.env.JWT_KEY, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
          
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    };
                    res.cookie('jwt', token, cookieOptions);
          
                    res.status(201).redirect("/");
                });
            }
        });
    });
};

exports.connecter = async (req, res, next) => {
    console.log(req.cookies);
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_KEY
            );
  
            console.log("decoded");
            console.log(decoded);
  
            db.start.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
                console.log(result)
                if(!result) {
                    return next();
                }

                req.user = result[0];

                console.log("next")
                return next();
            });
        } catch (error) {
            return next();
        }
    } else {
        next();
    }
};
  
exports.deconnexion = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).redirect("/");
};