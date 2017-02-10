var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Todo API Root');
});


// GET/todos?completed={boolean}&q={string}
app.get('/todos', function(req, res) {
  var query = req.query;
  var filteredTodos = todos;

  if (query.hasOwnProperty('completed') && query.completed.length > 0) {
    switch (query.completed) {
      case 'true':
        filteredTodos = _.where(todos, {
          completed: true
        });
        break;
      case 'false':
        filteredTodos = _.where(todos, {
          completed: false
        });
        break;
    }
  }

  if (query.hasOwnProperty('q') && query.q.length > 0) {
    filteredTodos = _.filter(filteredTodos, function(todo) {
      return todo.description.toLowerCase().indexOf(query.q.toLowerCase) > -1;
    });
  }

  res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
  var todoID = parseInt(req.params.id);
  var todoOutput = _.findWhere(todos, {
    id: todoID
  });

  if (todoOutput) {
    res.json(todoOutput);
  } else {
    res.status(404).send('No todo with ID ' + todoID + '!');
  }
});

// POST /todos
app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  console.log(db);

  db.todo.create(body).then(function(todo) {
    res.json(todo.toJSON());
  }).catch(function(e) {
    res.status(400).json(e);
  });

  // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  //   return res.status(400).json({
  //     "error": "Data provided was not valid!"
  //   });
  // }

  // body.id = todoNextId++;
  // body.description = body.description.trim();
  // todos.push(body);
  // res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoID = parseInt(req.params.id);
  var todoOutput = _.findWhere(todos, {
    id: todoID
  });

  if (todoOutput) {
    todos = _.without(todos, todoOutput);
    res.json(todoOutput);
  } else {
    res.status(404).json({
      "error": "No todo with ID " + todoID
    });
  }
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var todoID = parseInt(req.params.id);
  var body = _.pick(req.body, 'description', 'completed');
  var todoOutput = _.findWhere(todos, {
    id: todoID
  });

  if (!todoOutput) {
    return res.status(404).json({
      "error": "No todo with ID " + todoID
    });
  }

  var validAttributes = {};

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).json({
      "error": "The data provided was not valid!"
    })
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).json({
      "error": "The data provided was not valid!"
    });
  }

  _.extend(todoOutput, validAttributes);
  res.json(todoOutput);
});

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Listening on port ' + PORT + '!');
  });
});