const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, dbObject) => {
  if (error) {
    console.log('unable to connect to mongodb server');
  } else {
    console.log('connected to mongodb server!');
  }

  const myDB = dbObject.db('TodoApp');

  // myDB.collection('Todos').insertOne({
  //   text: 'something to do',
  //   completed: false
  // }, (error, result) => {
  //   if (error) {
  //     console.log('unable to insert todo');
  //   } else {
  //     console.log(JSON.stringify(result.ops, undefined, 2));
  //   }
  // });

  myDB.collection('Users').insertOne({
    name: 'shinno',
    age: 25,
    location: 'Japan'
  }, (error, result) => {
    if (error) {
      console.log('unable to insert user');
    } else {
      console.log(JSON.stringify(result.ops, undefined, 2));
    }
  });

  dbObject.close();
});

