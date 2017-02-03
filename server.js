var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});


// GET
app.get('/todos', function(req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoID = parseInt(req.params.id);
	var todoOutput = _.findWhere(todos, { id: todoID });

	if(todoOutput) {
		res.json(todoOutput);
	} else {
		res.status(404).send('No todo with ID ' + todoID + '!');
	}
});

// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send('Data provided was not valid!');
	}

	body.id = todoNextId++;
	body.description = body.description.trim();
	todos.push(body);
	res.json(body);
});

app.listen(PORT, function() {
	console.log('Listening on port ' + PORT + '!');
});