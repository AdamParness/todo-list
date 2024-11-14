// src/todo.js
import { format } from "date-fns";

export class TodoItem {
    constructor(title, description, dueDate, priority, projectId = 'default') {
        this.title = title;
        this.description = description;
        this.dueDate = format(new Date(dueDate), "MM/dd/yyyy");
        this.priority = priority;
        this.completed = false;
        this.projectId = projectId;
        this.id = Date.now().toString(); // unique identifier
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    updatePriority(newPriority) {
        this.priority = newPriority;
    }
}

export class Project {
    constructor(name) {
        this.name = name;
        this.id = Date.now().toString();
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }
}