class Todo {
    id: number;
    content: string;
    completed: boolean;
  
    constructor(id: number, content: string) {
      this.id = id;
      this.content = content;
      this.completed = false;
    }
  
    toJSON() {
      return {
        id: this.id,
        content: this.content,
        completed: this.completed,
      };
    }
  }
  
  class TodoList {
    tasks: Todo[] = [];
  
    addTask(content: string) {
      const id = this.tasks.length + 1;
      const task = new Todo(id, content);
      this.tasks.push(task);
    }
  
    deleteTask(taskId: number) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    }
  
    updateTaskCompletion(taskId: number, completed: boolean) {
      const task = this.tasks.find(task => task.id === taskId);
      if (task) {
        task.completed = completed;
      }
    }
  
    saveToLocalStorage() {
      const tasksJSON = JSON.stringify(this.tasks);
      console.log("Tasks:", tasksJSON)
      localStorage.setItem('tasks', tasksJSON);
    }
  
    loadFromLocalStorage() {
      const tasksJSON = localStorage.getItem('tasks');
      if (tasksJSON) {
        const tasksData = JSON.parse(tasksJSON);
        this.tasks = tasksData.map((taskData: any) => {
          const task = new Todo(taskData.id, taskData.content);
          task.completed = taskData.completed;
          return task;
        });
      }
    }
  }
  
  const todoList = new TodoList();
  
  async function fetchTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    return tasks;
  }
  
  async function loadTasksFromServer() {
    const tasksFromServer = await fetchTasks();
    todoList.tasks = tasksFromServer;
    updateUI();
  }
  
  loadTasksFromServer();
  
  const taskInput = document.getElementById('taskInput') as HTMLInputElement;
  const addTaskBtn = document.getElementById('addTaskBtn');
  
  addTaskBtn.addEventListener('click', async () => {
    const taskContent = taskInput.value.trim();
    if (taskContent !== '') {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: taskContent, completed: false }),
      });
  
      if (response.ok) {
        loadTasksFromServer();
        taskInput.value = '';
      }
    }
  });
  
  function updateUI() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
  
    todoList.tasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.classList.add('task-item');
  
      const completeCheckbox = document.createElement('input');
      completeCheckbox.type = 'checkbox';
      completeCheckbox.checked = task.completed;
      completeCheckbox.classList.add('mr-2');
      completeCheckbox.addEventListener('change', () => {
        updateTaskCompletion(task.id, completeCheckbox.checked);
      });
  
      const taskContent = document.createElement('span');
      taskContent.textContent = task.content;
      taskContent.style.flexGrow = '1';
      taskContent.style.textDecoration = task.completed ? 'line-through' : 'none';
  
      const status = document.createElement('span');
      status.textContent = task.completed ? 'Completed' : 'Not Completed';
      status.classList.add('ml-4');
  
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
      });
  
      taskItem.appendChild(completeCheckbox);
      taskItem.appendChild(taskContent);
      taskItem.appendChild(status);
      taskItem.appendChild(deleteBtn);
      taskList.appendChild(taskItem);
    });
  }
  
  function deleteTask(taskId: number) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'DELETE',
    }).then(() => {
      loadTasksFromServer();
    });
  }
  
  function updateTaskCompletion(taskId: number, completed: boolean) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    }).then(() => {
      loadTasksFromServer();
    });
  }
  