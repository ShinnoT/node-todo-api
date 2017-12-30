// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// // manually randomely generating new object _ids:
// let obj = new ObjectID();
// console.log(obj);
// // however it is just easier to let mongodb automatically do this

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, dbObject) => {
  if (error) {
    return console.log('unable to connect to mongodb server');
  }
  console.log('connected to mongodb server!');

// you need this from version @3~
  const myDB = dbObject.db('TodoApp');

  myDB.collection('Todos').find().toArray().then((docs) => {
    console.log('todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (error) => {
    console.log('unable to fetch todos', error);
  });

  dbObject.close();
});

