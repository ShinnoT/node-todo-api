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

  // myDB.collection('Todos').insertOne({
  //   text: 'something to do',
  //   completed: false
  // }, (error, result) => {
  //   if (error) {
  //     console.log('unable to insert todo ', error);
  //   } else {
  //     console.log(JSON.stringify(result.ops, undefined, 2));
  //   }
  // });


  //here we didnt specify _id property however you can manually set id as well
  myDB.collection('Users').insertOne({
    name: 'shinno2',
    age: 27,
    location: 'Korea'
  }, (error, result) => {
    if (error) {
      console.log('unable to insert user ', error);
    } else {
      // console.log(JSON.stringify(result.ops, undefined, 2));
      // result.ops is an array of all the objects in the collection
      console.log(result.ops[0]._id.getTimestamp());
    }
  });

  dbObject.close();
});



//object DESTRUCTURING

// let user = {name: 'shinno', age: 25};
// // to destrcuture and get a variable of the user name:
// let {name} = user;
// // this is the same thing as:
// // let name = user.name;
// // you can also get two variables at once by:
// let {name, age} = user
