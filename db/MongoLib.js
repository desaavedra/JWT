const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var mongoApi = {};
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myprojectjwt';

// Create a new MongoClient
const client = new MongoClient(url,{ useUnifiedTopology: true });




// Lo primero que hace es hacer un callback para luego ser usada
const getDatabase = (callback) => {
  // Pega el código tal cual de la base de datos 
  client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    // Añade esto. Esto quiere decir que la función depués de tener la base
    // hará la función que le llegue por parámetro
    callback(db, client);
  });
}
// Use connect method to connect to the Server
const insertDocuments = function (db, callback, data) {
  console.log(data)
  const collection = db.collection('documents');
  collection.insertMany([data], function (err, result) {
    console.log("Inserting document!")
    callback(result);
  });
}

const findDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log(docs)
    callback(docs);
  });

}

const updateDocument = function (db, username, rol, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.updateOne({  username: username }, { $set: { rol: rol } }, function(err, result){
    callback(result);
  })

}

const findDocumentsByUser = function (db, usuario, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Find some documents
    collection.find({username: usuario}).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log(docs)
      callback(docs);
    });
  
  }

exports.getDatabase = getDatabase;
exports.insertDocuments = insertDocuments;
exports.findDocuments = findDocuments;
exports.findDocumentsByUser = findDocumentsByUser;
exports.updateDocument = updateDocument;