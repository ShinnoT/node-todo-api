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

//find all those with completed: true
  // myDB.collection('Todos').find({completed: true}).toArray().then((docs) => {
  //   console.log('todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (error) => {
  //   console.log('unable to fetch todos', error);
  // });

//find one with id that equals 5a47a70a66c35437aba0845d
//however _id is not a string, rather, it is a an object called id
//so we must make a new id object first with the id string
  // myDB.collection('Todos').find({_id: new ObjectID('5a47a70a66c35437aba0845d')}).toArray().then((docs) => {
  //   console.log('todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (error) => {
  //   console.log('unable to fetch todos', error);
  // });

//counting the number of documents in collection
  myDB.collection('Todos').find().count().then((count) => {
    console.log(`todos count: ${count}`);
  }, (error) => {
    console.log('unable to fetch todos', error);
  });

  dbObject.close();
});

