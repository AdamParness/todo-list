// src/domHandler.js
export class DOMHandler {
    constructor(projectManager) {
        this.projectManager = projectManager;
        this.activeProjectId = null;
        this.initializeDOM();
    }

    initializeDOM() {
        const content = document.createElement('div');
        content.id = 'content';
        document.body.appendChild(content);

        // Create project section
        const projectSection = document.createElement('div');
        projectSection.id = 'projects';
        content.appendChild(projectSection);

        // Create todo section
        const todoSection = document.createElement('div');
        todoSection.id = 'todos';
        content.appendChild(todoSection);

        // Add styles for active button
        const style = document.createElement('style');
        style.textContent = `
            .active-project-btn {
                background-color: #4CAF50;
                color: white;
                font-weight: bold;
                border: 2px solid #45a049;
            }
        `;
        document.head.appendChild(style);

        this.createProjectForm();
        this.createTodoForm();
        this.renderProjects();
    }

    createProjectForm() {
        const form = document.createElement('form');
        form.id = 'project-form';
        form.innerHTML = `
            <input type="text" id="project-name" placeholder="New Project Name" required>
            <button type="submit">Create Project</button>
        `;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('project-name').value;
            const newProject = this.projectManager.createProject(name);
            this.renderProjects();
            // Select the newly created project
            this.renderTodos(newProject.id);
            form.reset();
        });

        document.getElementById('projects').appendChild(form);
    }

    createTodoForm() {
        const form = document.createElement('form');
        form.id = 'todo-form';
        form.innerHTML = `
            <input type="text" id="todo-title" placeholder="Title" required>
            <input type="text" id="todo-description" placeholder="Description" required>
            <input type="date" id="todo-date" required>
            <select id="todo-priority" required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <select id="todo-project" required></select>
            <button type="submit">Add Todo</button>
        `;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('todo-title').value;
            const description = document.getElementById('todo-description').value;
            const dueDate = document.getElementById('todo-date').value;
            const priority = document.getElementById('todo-priority').value;
            const projectId = document.getElementById('todo-project').value;

            this.projectManager.createTodo(title, description, dueDate, priority, projectId);
            this.renderTodos(projectId);
            form.reset();
        });

        document.getElementById('todos').appendChild(form);
    }

    renderProjects() {
        const projectList = document.createElement('div');
        projectList.id = 'project-list';
        
        this.projectManager.projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.classList.add('project');
            projectDiv.innerHTML = `
                <h3>${project.name}</h3>
            `;
            
            const viewButton = document.createElement('button');
            viewButton.textContent = 'View Todos';
            // Add active class if this is the current project
            if (project.id === this.activeProjectId) {
                viewButton.classList.add('active-project-btn');
            }
            
            viewButton.addEventListener('click', () => {
                this.activeProjectId = project.id;
                this.renderTodos(project.id);
                this.renderProjects(); // Re-render to update button styles
            });
            
            projectDiv.appendChild(viewButton);
            projectList.appendChild(projectDiv);
        });

        const oldList = document.getElementById('project-list');
        if (oldList) oldList.remove();
        document.getElementById('projects').appendChild(projectList);

        // Update project select in todo form
        const projectSelect = document.getElementById('todo-project');
        projectSelect.innerHTML = this.projectManager.projects
            .map(project => `<option value="${project.id}">${project.name}</option>`)
            .join('');
        
        // Set the selected project in the form
        if (this.activeProjectId) {
            projectSelect.value = this.activeProjectId;
        }
    }

    renderTodos(projectId) {
        this.activeProjectId = projectId; // Update active project
        const project = this.projectManager.getProject(projectId);
        const todoList = document.createElement('div');
        todoList.id = 'todo-list';

        project.todos.forEach(todo => {
            const todoDiv = document.createElement('div');
            todoDiv.classList.add('todo');
            
            // Create the todo content
            todoDiv.innerHTML = `
                <h4>${todo.title}</h4>
                <p>${todo.description}</p>
                <p>Due: ${todo.dueDate}</p>
                <p>Priority: ${todo.priority}</p>
            `;

            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => {
                this.projectManager.toggleTodoComplete(todo.id, projectId);
                this.renderTodos(projectId);
            });
            todoDiv.appendChild(checkbox);

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                this.projectManager.deleteTodo(todo.id, projectId);
                this.renderTodos(projectId);
            });
            todoDiv.appendChild(deleteButton);

            todoList.appendChild(todoDiv);
        });

        const oldList = document.getElementById('todo-list');
        if (oldList) oldList.remove();
        document.getElementById('todos').appendChild(todoList);

        // Update projects view to reflect the active project
        this.renderProjects();
    }
}