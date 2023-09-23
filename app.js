import { createSignal, createEffect } from './signal.js';

const form = document.querySelector('#todo-form');
const todoList = document.querySelector('#todo-list');
const count = document.querySelector('#todo-count');
const todoMessage = document.querySelector('.todo-message');

const todos = createSignal(getSavedTodos() || []);

function getSavedTodos() {
	return JSON.parse(localStorage.getItem('todos'));
}

function cacheTodos(todos) {
	localStorage.setItem('todos', JSON.stringify(todos));
}

for (let todo of todos.value) {
	todoList.appendChild(CreateTodoItem(todo));
}

createEffect(() => {
	cacheTodos(todos.value);
	count.textContent = todos.value.length;
	todoMessage.textContent = todos.value.length === 0 ? 'No todos found.' : '';
});

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
	todos.value = [...todos.value, newTodo];
	todoList.appendChild(CreateTodoItem(newTodo));
}

function deleteTodo(id) {
	todos.value = todos.value.filter((todo) => todo.id !== Number(id));
}

function handleSubmit(e) {
	e.preventDefault();
	const formData = new FormData(e.target);
	const todo = formData.get('todo-input');
	addTodo(todo);
	e.target.reset();
}

form.addEventListener('submit', handleSubmit);
