// src/index.js
import './styles.css';
import { ProjectManager } from './projectManager.js';
import { DOMHandler } from './domHandler.js';

const projectManager = new ProjectManager();
const domHandler = new DOMHandler(projectManager);

// Initialize with default project
const defaultProject = projectManager.projects[0];
domHandler.renderTodos(defaultProject.id);