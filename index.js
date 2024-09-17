document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const voiceCommandBtn = document.getElementById('voice-command-btn');
    const listeningPopup = document.getElementById('listening-popup');

    // Function to get the current date in a readable format
    function getCurrentDate() {
        const date = new Date();
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Function to create and append a task item to the list
    function createTaskElement(taskName) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        
        // Get the current date
        const dateCreated = getCurrentDate();

        // Append task name and date
        taskItem.innerHTML = `
            <span class="task-name">${taskName}</span>
            <span class="task-date">Created on: ${dateCreated}</span>
            <div class="task-actions">
                <input type="checkbox" class="complete-checkbox">
                <span class="edit-icon">&#9998;</span>
                <span class="delete-icon">&#128465;</span>
            </div>
        `;
        return taskItem;
    }

    // Function to add a new task
    function addTask(taskName) {
        if (!taskName.trim()) {
            alert('Task name cannot be empty.');
            return;
        }

        const taskItem = createTaskElement(taskName);
        taskList.appendChild(taskItem);
        taskInput.value = '';
    }

    // Event handler for editing a task name
    function handleEditTask(event) {
        const taskNameElem = event.target.closest('.task-name');
        if (!taskNameElem) return;

        const newTaskName = prompt('Edit task name:', taskNameElem.textContent);
        if (newTaskName && newTaskName.trim()) {
            taskNameElem.textContent = newTaskName.trim();
        }
    }

    // Event handler for marking a task as completed
    function handleCompleteTask(event) {
        if (event.target.classList.contains('complete-checkbox')) {
            const taskItem = event.target.closest('.task-item');
            taskItem.classList.toggle('completed');
        }
    }

    // Event handler for deleting a task
    function handleDeleteTask(event) {
        if (event.target.classList.contains('delete-icon')) {
            const taskItem = event.target.closest('.task-item');
            taskItem.remove();
        }
    }

    // Task list event delegation for edit, complete, and delete actions
    taskList.addEventListener('click', (event) => {
        if (event.target.classList.contains('task-name')) {
            handleEditTask(event);
        }
        if (event.target.classList.contains('complete-checkbox')) {
            handleCompleteTask(event);
        }
        if (event.target.classList.contains('delete-icon')) {
            handleDeleteTask(event);
        }
    });

    // Add task on button click
    addTaskBtn.addEventListener('click', () => {
        if (taskInput.value.trim()) {
            addTask(taskInput.value);
        } else {
            alert('Please enter a valid task.');
        }
    });

    // Voice command functionality with automatic language detection
    voiceCommandBtn.addEventListener('click', () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        
        // Use the user's browser/system language automatically
        const userLanguage = navigator.language || 'en-US'; // Default to 'en-US' if no language detected
        recognition.lang = userLanguage;

        // Show "Listening..." pop-up
        listeningPopup.style.display = 'block';

        recognition.start();

        recognition.onresult = (event) => {
            // Hide "Listening..." pop-up
            listeningPopup.style.display = 'none';

            const voiceInput = event.results[0][0].transcript;
            addTask(voiceInput);
        };

        recognition.onerror = (event) => {
            // Hide "Listening..." pop-up on error
            listeningPopup.style.display = 'none';
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            // Hide "Listening..." pop-up when recognition ends
            listeningPopup.style.display = 'none';
        };
    });
});
