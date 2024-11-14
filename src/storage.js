// src/storage.js
import { Project, TodoItem } from './todo.js';

export const Storage = {
    saveProjects(projects) {
        localStorage.setItem('todoProjects', JSON.stringify(projects));
    },

    getProjects() {
        const projectsData = localStorage.getItem('todoProjects');
        if (!projectsData) return [];

        // Reconstruct Project objects with their methods
        const rawProjects = JSON.parse(projectsData);
        return rawProjects.map(projectData => {
            const project = new Project(projectData.name);
            project.id = projectData.id;
            // Reconstruct TodoItem objects
            project.todos = projectData.todos.map(todoData => {
                const todo = new TodoItem(
                    todoData.title,
                    todoData.description,
                    todoData.dueDate,
                    todoData.priority,
                    todoData.projectId
                );
                todo.id = todoData.id;
                todo.completed = todoData.completed;
                return todo;
            });
            return project;
        });
    }
};