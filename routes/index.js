var express = require('express');
let jwt = require('jsonwebtoken');
var router = express.Router();
const mongo = require("../db/MongoLib");
var HandlerGenerator = require("../handlegenerator.js");
var middleware = require("../middleware.js");

HandlerGenerator = new HandlerGenerator();

/* GET home page. */
router.get('/', middleware.checkToken, HandlerGenerator.index);

router.post('/login', HandlerGenerator.login);

router.post('/edit', middleware.checkToken, function (req, res) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
            console.log(jwt.decode(token).rol)
            if (jwt.decode(token).rol === "admin") {
                mongo.getDatabase(db => {
                    mongo.updateDocument(db, req.body.username, req.body.rolNuevo, result => {
                        res.json({
                            success: true
                        });
                    }
                    )
                });
            }
            else {
                res.json({
                    success: false,
                    message: "No tiene los permisos para editar la info"
                });
            }
        }
    }
})

router.post('/signin', function (req, res) {
    mongo.getDatabase(db => {
        var crypto = require('crypto')
        console.log(req.body.username)
        mongo.findDocumentsByUser(db, req.body.username, docs => {
            console.log(docs.length)
            if (docs.length == 0) {
                console.log("entré al primer if")
                var hmac = crypto.createHmac('sha1', req.body.username).update(req.body.password).digest('hex')
                console.log(hmac)
                mongo.insertDocuments(db, data => {

                    res.send(req.body);
                }, { username: req.body.username, password: hmac, rol: req.body.rol })
            }
            else {
                console.log("entré al 2 if")
                res.status(403).send('El username ya está siendo utilizado');
            }

        })

    });
});

module.exports = router;