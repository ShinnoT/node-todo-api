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


//deleteMany
  // myDB.collection('Todos').deleteMany({text: 'blah blah blah'}).then((result) => {
  //   console.log(result);
  // }, (error) => {
  //   console.log('cant delete', error);
  // });


//deleteOne
  // myDB.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
  //   console.log(result);
  // }, (error) => {
  //   console.log('cant delete', error);
  // });

//findOneAndDelete
  // myDB.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // }, (error) => {
  //   console.log('couldnt delete', error);
  // });

  dbObject.close();
});

