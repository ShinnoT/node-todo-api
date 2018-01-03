const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');


// remove multiple records
// cant keep argument empty, must pass empty object
// Todo.remove({}).then((result) => {
//   console.log(result);
// });


// Todo.findOneAndRemove
Todo.findByIdAndRemove({_id: '5a4bc52c0ddfc03a088daa52'}).then((todo) => {
  console.log(todo);
});

// Todo.findByIdAndRemove
Todo.findByIdAndRemove('5a4bc52c0ddfc03a088daa52').then((todo) => {
  console.log(todo);
});
