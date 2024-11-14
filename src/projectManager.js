// src/projectManager.js
import { Project, TodoItem } from './todo.js';
import { Storage } from './storage.js';

export class ProjectManager {
    constructor() {
        this.projects = Storage.getProjects();
        
        // Create default project if none exists
        if (this.projects.length === 0) {
            this.projects.push(new Project('Default'));
            this.saveProjects();
        }
    }

    createProject(name) {
        const project = new Project(name);
        this.projects.push(project);
        this.saveProjects();
        return project;
    }

    getProject(projectId) {
        return this.projects.find(project => project.id === projectId);
    }

    createTodo(title, description, dueDate, priority, projectId) {
        const todo = new TodoItem(title, description, dueDate, priority, projectId);
        const project = this.getProject(projectId);
        if (project) {
            // Make sure addTodo exists
            if (typeof project.addTodo !== 'function') {
                // Reconstruct the project if needed
                Object.setPrototypeOf(project, Project.prototype);
            }
            project.addTodo(todo);
            this.saveProjects();
        }
        return todo;
    }

    toggleTodoComplete(todoId, projectId) {
        const project = this.getProject(projectId);
        const todo = project.todos.find(t => t.id === todoId);
        if (todo) {
            // Make sure toggleComplete exists
            if (typeof todo.toggleComplete !== 'function') {
                Object.setPrototypeOf(todo, TodoItem.prototype);
            }
            todo.toggleComplete();
            this.saveProjects();
        }
    }

    deleteTodo(todoId, projectId) {
        const project = this.getProject(projectId);
        if (project) {
            // Make sure removeTodo exists
            if (typeof project.removeTodo !== 'function') {
                Object.setPrototypeOf(project, Project.prototype);
            }
            project.removeTodo(todoId);
            this.saveProjects();
        }
    }

    saveProjects() {
        Storage.saveProjects(this.projects);
    }
}