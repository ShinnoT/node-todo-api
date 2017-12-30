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


//findOneAndUpdate
  // myDB.collection('Todos').findOneAndUpdate({
  //   text: 'eat dinner'
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // }, (error) => {
  //   console.log('sorry cant update', error);
  // });

//increment age using $inc
  myDB.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a442687b671920bbe256583')
  }, {
    $inc: {
      age: 1
    },
    $set: {
      name: 'newSHINNO'
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  }, (error) => {
    console.log('sorry couldnt increment', error);
  });


  dbObject.close();
});

