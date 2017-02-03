var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Get milk',
	completed: false
}, {
	id: 2,
	description: 'Have lunch',
	completed: false
}, {
	id: 3,
	description: 'Feed the cat',
	completed: true
}];

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
	var todoOutput;

	todos.forEach(function(todo) {
		if(todo.id == todoID) {
			todoOutput = todo;
		}
	});

	if(todoOutput) {
		res.json(todoOutput);
	} else {
		res.status(404).send('No todo with ID ' + todoID + '!');
	}
});

app.listen(PORT, function() {
	console.log('Listening on port ' + PORT + '!');
});