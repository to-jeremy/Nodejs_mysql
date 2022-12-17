const express = require("express");
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config({path: './.env'});
const db = require('./model/db');
const { start } = require("repl");

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

const publicDirectoryPath = path.join(__dirname, './public');
app.use(express.static(publicDirectoryPath));


db.start.connect(function(error) {
    if(error) {
        console.log("Erreur de connexion avec la base de donnée !")
    } else {
        console.log("Le serveur MySQL est en route...")
    }
});

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5001, () => {
    console.log("Le serveur démarre sur le port 5001.");
});
