require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//--------------------------------------------
//create in rails
// app.post("/todos", authenticate, (request, response) => {
//   // console.log(request.body);
//   let todo = new Todo({
//     text: request.body.text,
//     _creator: request.user._id
//   });

//   todo.save().then(
//     doc => {
//       response.send(doc);
//     },
//     error => {
//       response.status(400).send(error);
//     }
//   );
// });

// async es7 version:
app.post("/todos", authenticate, async (request, response) => {
  try {
    let todo = new Todo({
      text: request.body.text,
      _creator: request.user._id
    });
    const doc = await todo.save();
    response.send(doc);
  } catch (error) {
    response.status(400).send(error);
  }
});

//--------------------------------------------
//index in rails
// app.get("/todos", authenticate, (request, response) => {
//   Todo.find({ _creator: request.user._id }).then(
//     todos => {
//       // response.send(todos);
//       // the above code works but it will return an array of todos
//       // by explicitly returning an object it will be more customizable later
//       // thus:
//       response.send({ todos });
//     },
//     error => {
//       response.status(400).send(error);
//     }
//   );
// });

// async es7 version:
app.get("/todos", authenticate, async (request, response) => {
  try {
    const todos = await Todo.find({ _creator: request.user._id });
    response.send({ todos });
  } catch (error) {
    response.status(400).send(error);
  }
});

//--------------------------------------------
//show in rails
// app.get("/todos/:id", authenticate, (request, response) => {
//   let id = request.params.id;
//   if (!ObjectID.isValid(id)) {
//     return response.status(404).send();
//   }
//   Todo.findOne({
//     _id: id,
//     _creator: request.user._id
//   })
//     .then(todo => {
//       if (!todo) {
//         return response.status(404).send();
//       }
//       response.send({ todo });
//     })
//     .catch(error => {
//       response.status(400).send();
//     });
// });

// async es7 version:
app.get("/todos/:id", authenticate, async (request, response) => {
  try {
    let id = request.params.id;
    if (!ObjectID.isValid(id)) {
      return response.status(404).send();
    }
    const todo = await Todo.findOne({
      _id: id,
      _creator: request.user._id
    });
    if (!todo) {
      return response.status(404).send();
    }
    response.send({ todo });
  } catch (error) {
    response.status(400).send();
  }
});

//--------------------------------------------
//destroy in rails (or delete?)
// app.delete("/todos/:id", authenticate, (request, response) => {
//   let id = request.params.id;
//   if (!ObjectID.isValid(id)) {
//     return response.status(404).send();
//   }
//   Todo.findOneAndRemove({
//     _id: id,
//     _creator: request.user._id
//   })
//     .then(todo => {
//       if (!todo) {
//         return response.status(404).send();
//       }
//       response.send({ todo });
//     })
//     .catch(error => {
//       response.status(400).send();
//     });
// });

// async es7 version:
app.delete("/todos/:id", authenticate, async (request, response) => {
  try {
    let id = request.params.id;
    if (!ObjectID.isValid(id)) {
      return response.status(404).send();
    }
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: request.user._id
    });
    if (!todo) {
      return response.status(404).send();
    }
    response.send({ todo });
  } catch (error) {
    response.status(400).send();
  }
});

//--------------------------------------------
//update in rails
// app.patch("/todos/:id", authenticate, (request, response) => {
//   let id = request.params.id;
//   let body = _.pick(request.body, ["text", "completed"]);
//   if (!ObjectID.isValid(id)) {
//     return response.status(404).send();
//   }

//   if (_.isBoolean(body.completed) && body.completed) {
//     body.completedAt = new Date().getTime();
//   } else {
//     body.completed = false;
//     body.completedAt = null;
//   }

//   Todo.findOneAndUpdate(
//     { _id: id, _creator: request.user._id },
//     { $set: body },
//     { new: true }
//   )
//     .then(todo => {
//       if (!todo) {
//         return response.status(404).send();
//       }
//       response.send({ todo });
//     })
//     .catch(error => {
//       response.status(400).send();
//     });
// });

// async es7 version:
app.patch("/todos/:id", authenticate, async (request, response) => {
  try {
    let id = request.params.id;
    let body = _.pick(request.body, ["text", "completed"]);
    if (!ObjectID.isValid(id)) {
      return response.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: id, _creator: request.user._id },
      { $set: body },
      { new: true }
    );
    if (!todo) {
      return response.status(404).send();
    }
    response.send({ todo });
  } catch (error) {
    response.status(400).send();
  }
});

//--------------------------------------------
//user authentication--------------
//sign-up
// app.post("/users", (request, response) => {
//   let body = _.pick(request.body, ["email", "password"]);
//   let user = new User(body);

//   user
//     .save()
//     .then(() => {
//       return user.generateAuthToken();
//       // response.send({user});
//     })
//     .then(token => {
//       response.header("x-auth", token).send(user);
//     })
//     .catch(error => {
//       response.status(400).send(error);
//     });
// });

// async version:
app.post("/users", async (request, response) => {
  try {
    const body = _.pick(request.body, ["email", "password"]);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    response.header("x-auth", token).send(user);
  } catch (error) {
    response.status(400).send(error);
  }
});

//--------------------------------------------
//using middleware function called authenticate
//./middleware/authenticate.js
app.get("/users/me", authenticate, (request, response) => {
  response.send(request.user);
});

//--------------------------------------------
//sign-in
// app.post("/users/login", (request, response) => {
//   let body = _.pick(request.body, ["email", "password"]);

//   User.findByCredentials(body.email, body.password)
//     .then(user => {
//       // response.send(user);
//       return user.generateAuthToken().then(token => {
//         response.header("x-auth", token).send(user);
//       });
//     })
//     .catch(error => {
//       response.status(400).send();
//     });
// });

// async syntax version:
app.post("/users/login", async (request, response) => {
  try {
    const body = _.pick(request.body, ["email", "password"]);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    response.header("x-auth", token).send(user);
  } catch (error) {
    response.status(400).send();
  }
});

//--------------------------------------------
//log-out
//doing this by deleting token
// app.delete("/users/me/token", authenticate, (request, response) => {
//   request.user
//     .removeToken(request.token)
//     .then(() => {
//       response.status(200).send();
//     })
//     .catch(error => {
//       response.status(400).send();
//     });
// });

// async syntax version of DELETE:
app.delete("/users/me/token", authenticate, async (request, response) => {
  try {
    await request.user.removeToken(request.token);
    response.status(200).send();
  } catch (error) {
    response.status(400).send();
  }
});

//--------------------------------------------
app.listen(port, () => {
  console.log(`started app on port ${port}`);
});

module.exports = {
  app
};

//--------------------------------------------
//model validations
//moved to separate files in models folder

// //create new instance of model
// let newTodo = new Todo({
//   text: 'cook dinner',
//   completed: false,
// });

// //creating new instance of a model alone does not insert in into DB
// //we must use the save function
// newTodo.save().then((doc) => {
//   console.log('saved todo task');
//   console.log(doc);
// }, (error) => {
//   console.log('unable to save todo task', error);
// });

// let newUser = new User({
//   email: 'blah@hhhhhhhh.cmo'
// });

// newUser.save().then((doc) => {
//   console.log('user saved');
//   console.log(doc);
// }, (error) => {
//   console.log('unable to save', error);
// });

//random note
