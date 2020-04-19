let jwt = require('jsonwebtoken');
let config = require('./config');
const mongo = require("./db/MongoLib");

// Clase encargada de la creación del token
class HandlerGenerator {

  login(req, res) {

    // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
    let username = req.body.username;
    let password = req.body.password;
    mongo.getDatabase(db => {
      mongo.findDocumentsByUser(db, username, docs => {
        console.log(docs)
        let usuario = docs[0]
        // Este usuario y contraseña, en un ambiente real, deben ser traidos de la BD
        let mockedUsername = usuario.username;
        let mockedPassword = usuario.password;
        let rol = usuario.rol;

        // Si se especifico un usuario y contraseña, proceda con la validación
        // de lo contrario, un mensaje de error es retornado
        if (username && password) {
          var crypto = require('crypto')
          var hmac = crypto.createHmac('sha1', username).update(password).digest('hex')
          // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
          // de lo contrario, un mensaje de error es retornado
          if (username === mockedUsername && hmac === mockedPassword) {

            // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
            let token = jwt.sign({ username: username, rol: rol },
              config.secret, { expiresIn: '24h' });

            // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
            res.json({
              success: true,
              message: 'Authentication successful!',
              token: token
            });

          } else {

            // El error 403 corresponde a Forbidden (Prohibido) de acuerdo al estándar HTTP
            res.send(403).json({
              success: false,
              message: 'Incorrect username or password'
            });

          }

        } else {

          // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
          res.send(400).json({
            success: false,
            message: 'Authentication failed! Please check the request'
          });

        }
      })
    })



  }

  index(req, res) {

    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        console.log(jwt.decode(token).rol)
        if (jwt.decode(token).rol === "admin") {
          mongo.getDatabase(db => {
            mongo.findDocuments(db, docs => {
              res.json({
                success: true,
                message: docs
              });
            })
          });
        }
        else if (jwt.decode(token).rol === "supervisor") {
          mongo.getDatabase(db => {
            mongo.findDocuments(db, docs => {
              docs.forEach(element => {
                delete element.password

              });
              res.json({
                success: true,
                message: docs
              });
            })
          });
        }
        else if (jwt.decode(token).rol === "trabajador") {
          mongo.getDatabase(db => {
            mongo.findDocuments(db, docs => {
              docs.forEach(element => {
                delete element.password
                delete element.rol
              });
              res.json({
                success: true,
                message: docs
              });
            })
          });
        }
      }


    }
    // Retorna una respuesta exitosa con previa validación del token


  }
}

module.exports = HandlerGenerator;