document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.querySelector('.task-list');
    const taskCount = document.getElementById('task-count');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    function renderTasks() {
        taskList.innerHTML = '';

        let filteredTasks = [];
        if (currentFilter === 'all') {
            filteredTasks = tasks;
        } else if (currentFilter === 'active') {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(t => t.completed);
        }

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `<p style="text-align:center;color:#888;">No ${currentFilter} tasks</p>`;
        }

        filteredTasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task-item' + (task.completed ? ' completed' : '');
            taskDiv.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button onclick="toggleComplete(${task.id})">✅</button>
                    <button class="edit-btn" onclick="editTask(${task.id})">✏️</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
                </div>
            `;
            taskList.appendChild(taskDiv);
        });

        updateTaskCount();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;

        const newTask = {
            id: Date.now(),
            text,
            completed: false
        };

        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    });

    window.toggleComplete = (id) => {
        const task = tasks.find(t => t.id === id);
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    };

    window.deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    };

    window.editTask = (id) => {
        const task = tasks.find(t => t.id === id);
        const newText = prompt('Edit Task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.textContent.toLowerCase();
            renderTasks();
        });
    });

    function updateTaskCount() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const active = total - completed;
        taskCount.textContent = `Active: ${active} | Completed: ${completed} | Total: ${total}`;
    }

    renderTasks();
});
