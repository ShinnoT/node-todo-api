const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


todos = [{
  _id: new ObjectID(),
  text: "first test todo"
}, {
  _id: new ObjectID(),
  text: "second test todo",
  completed: true,
  completedAt: 123
}];


//however in our test we assume that there is nothing in the DB
//most of the time there will actually be data in DB
//so we must run:
beforeEach((done) => {
  Todo.remove({}).then(() => {
    // console.log('removed everything from DB before test');
    // now however we include test todos (seeds)
    return Todo.insertMany(todos);
  }).then(() => {
    // chaining commands here because returning todos up there
    done();
  });
});
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
