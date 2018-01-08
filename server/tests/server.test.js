const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');




//however in our test we assume that there is nothing in the DB
//most of the time there will actually be data in DB
//so we must run:
beforeEach(populateUsers);
beforeEach(populateTodos);
//this says: before each test remove everything and add the two seeds



describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    let text = 'test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((response) => {
        expect(response.body.text).toBe(text);
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });


  it('should not create a new todo if bad data passed', (done) => {
    let badText = '';

    request(app)
      .post('/todos')
      .send({badText})
      .expect(400)
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });

});



describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((response) => {
        expect(response.body.todos.length).toBe(2);
      })
      .end(done);
  });
});


describe('GET /todos/:id', () => {
  it('should get specific instance of todo model', (done) => {
    let id = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    let id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .expect((response) => {
        expect(response.body.todo).toBe(undefined);
      })
      .end(done);
      //dont really need the expect toBe(undefined) 3 lines
  });

  it('should return 404 for non-obbjectID', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});


describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let id = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo._id).toBe(id);
      })
      .end((error,response) => {
        if (error) {
          return done(error);
        }
        //checking if it actually got deleted in DB after checking response
        Todo.findById(id).then((todo) => {
          expect(todo).toBeNull();
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });

  it('should return 404 if todo not found', (done) => {
    let id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should reeturn 404 if object id is invalid', (done) => {
    request(app)
      .get(`/todos/123abc`)
      .expect(404)
      .end(done);
  });
});


describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    let id = todos[0]._id.toHexString();
    let text = 'this should be the new text';
    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: true,
        text: text
      })
      .expect(200)
      .expect((response) => {
        let todoObject = response.body.todo;
        expect(todoObject.text).toBe(text);
        expect(todoObject.completed).toBe(true);
        expect(typeof todoObject.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    let id = todos[1]._id.toHexString();
    let text = 'this should be the new text number 2';
    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: false,
        text: text
      })
      .expect(200)
      .expect((response) => {
        let todoObject = response.body.todo;
        expect(todoObject.text).toBe(text);
        expect(todoObject.completed).toBe(false);
        expect(todoObject.completedAt).toBeNull();
      })
      .end(done);
  });
});


describe('GET /users/me', () => {

  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body._id).toBe(users[0]._id.toHexString());
        expect(response.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((response) => {
        expect(response.body).toEqual({});
      })
      .end(done);
  });

});




describe('POST /users', () => {

  it('should create user', (done) => {
    let email = 'newblah@example.com';
    let password = '1234567';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toBeDefined();
        expect(response.body._id).toBeDefined();
        expect(response.body.email).toBe(email);
      })
      // .end(done);
      // or:
      .end((error) => {
        if (error) {
          return done(error);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeDefined();
          expect(user.password).not.toBe(password);
          done();
        }).catch((error) => done(error));
      });
  });

  it('should return validation erros if request invalid', (done) => {
    let email = 'hello';

    request(app)
      .post('/users')
      .send({email})
      .expect(400)
      .end(done);
  });

  it('should not create user if email already used', (done) => {
    let email = users[0].email;
    let password = '1234567';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end((error) => {
        if (error) {
          return done(error);
        }

        User.find().then((users) => {
          expect(users.length).toBe(2);
          done();
        }).catch((error) => done(error));
      });
  });

});


describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toBeDefined();
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0].access).toBe('auth');
          expect(user.tokens[0].token).toBe(response.headers['x-auth']);
          done();
        }).catch((error) => done(error));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: 'whatever@email.com',
        password: users[1].password
      })
      .expect(400)
      .expect((response) => {
        expect(response.headers['x-auth']).toBeUndefined();
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((error) => done(error));
      });
  });
});


describe('DELETE /users/me/token', () => {

  it('should remove auth token on log-out', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((error) => done(error));
      });
  });

});
