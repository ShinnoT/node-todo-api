const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');



// mongoose automatically converts string ids into object ids

let id = '5a48f46a8cc5fa59c8217561';


if (!ObjectID.isValid(id)) {
  console.log('id not valid');
}


// returns all with matching queries in form of an array
Todo.find({
  _id: id
}).then((todos) => {
  if (todos.length === 0) {
    // handles cases when not an error but rather a value that is not in the collection
    return console.log('no object with that id sorry');
  }
  console.log('todos: ', todos);
}).catch((error) => {
  console.log(error);
});

// returns single object not an array
Todo.findOne({
  _id: id
}).then((todo) => {
  if (!todo) {
    return console.log('no object with that id sorry');
  }
  console.log('todo: ', todo);
}).catch((error) => {
  console.log(error);
});


//find one object by id
Todo.findById(id).then((todo) => {
  if (!todo) {
    return console.log('no object with that id sorry');
  }
  console.log('Todo By ID: ', todo);
}).catch((error) => {
  console.log(error);
});
