const form = document.querySelector('#todo-form');
const todoList = document.querySelector('#todo-list');

let todos = getSavedTodos() || [];

function getSavedTodos() {
	return JSON.parse(localStorage.getItem('todos'));
}
function cacheTodos(todos) {
	localStorage.setItem('todos', JSON.stringify(todos));
}

for (let todo of todos) {
	todoList.appendChild(CreateTodoItem(todo));
}

function CreateDeleteButton(id) {
	const button = document.createElement('button');
	button.textContent = '❌';
	button.id = id;
	button.className = 'todo-delete-btn';
	button.addEventListener('click', (e) => {
		deleteTodo(e.target.id);
		todoList.removeChild(document.getElementById(`todo-item-${e.target.id}`));
	});
	return button;
}
function CreateTodoItem(newTodo) {
	const li = document.createElement('li');
	li.textContent = newTodo.todo;
	li.className = 'todo-item';
	li.id = `todo-item-${newTodo.id}`;
	li.appendChild(CreateDeleteButton(newTodo.id));
	return li;
}

function addTodo(todo) {
	const newTodo = { id: new Date().getTime(), todo };
	todos.push(newTodo);
	cacheTodos(todos);
	todoList.appendChild(CreateTodoItem(newTodo));
}

function deleteTodo(id) {
	todos = todos.filter((todo) => todo.id !== Number(id));
	cacheTodos(todos);
}

function handleSubmit(e) {
	e.preventDefault();
	const formData = new FormData(e.target);
	const todo = formData.get('todo-input');
	addTodo(todo);
	e.target.reset();
}

form.addEventListener('submit', handleSubmit);
