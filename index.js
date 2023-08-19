var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var Todo = /** @class */ (function () {
    function Todo(id, content) {
        this.id = id;
        this.content = content;
        this.completed = false;
    }
    Todo.prototype.toJSON = function () {
        return {
            id: this.id,
            content: this.content,
            completed: this.completed,
        };
    };
    return Todo;
}());
var TodoList = /** @class */ (function () {
    function TodoList() {
        this.tasks = [];
    }
    TodoList.prototype.addTask = function (content) {
        var id = this.tasks.length + 1;
        var task = new Todo(id, content);
        this.tasks.push(task);
    };
    TodoList.prototype.deleteTask = function (taskId) {
        this.tasks = this.tasks.filter(function (task) { return task.id !== taskId; });
    };
    TodoList.prototype.updateTaskCompletion = function (taskId, completed) {
        var task = this.tasks.find(function (task) { return task.id === taskId; });
        if (task) {
            task.completed = completed;
        }
    };
    TodoList.prototype.saveToLocalStorage = function () {
        var tasksJSON = JSON.stringify(this.tasks);
        console.log("Tasks:", tasksJSON);
        localStorage.setItem('tasks', tasksJSON);
    };
    TodoList.prototype.loadFromLocalStorage = function () {
        var tasksJSON = localStorage.getItem('tasks');
        if (tasksJSON) {
            var tasksData = JSON.parse(tasksJSON);
            this.tasks = tasksData.map(function (taskData) {
                var task = new Todo(taskData.id, taskData.content);
                task.completed = taskData.completed;
                return task;
            });
        }
    };
    return TodoList;
}());
var todoList = new TodoList();
function fetchTasks() {
    return __awaiter(this, void 0, void 0, function () {
        var response, tasks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('http://localhost:3000/tasks')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    tasks = _a.sent();
                    return [2 /*return*/, tasks];
            }
        });
    });
}
function loadTasksFromServer() {
    return __awaiter(this, void 0, void 0, function () {
        var tasksFromServer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchTasks()];
                case 1:
                    tasksFromServer = _a.sent();
                    todoList.tasks = tasksFromServer;
                    updateUI();
                    return [2 /*return*/];
            }
        });
    });
}
loadTasksFromServer();
var taskInput = document.getElementById('taskInput');
var addTaskBtn = document.getElementById('addTaskBtn');
addTaskBtn.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    var taskContent, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                taskContent = taskInput.value.trim();
                if (!(taskContent !== '')) return [3 /*break*/, 2];
                return [4 /*yield*/, fetch('http://localhost:3000/tasks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ content: taskContent, completed: false }),
                    })];
            case 1:
                response = _a.sent();
                if (response.ok) {
                    loadTasksFromServer();
                    taskInput.value = '';
                }
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
function updateUI() {
    var taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    todoList.tasks.forEach(function (task) {
        var taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        var completeCheckbox = document.createElement('input');
        completeCheckbox.type = 'checkbox';
        completeCheckbox.checked = task.completed;
        completeCheckbox.classList.add('mr-2');
        completeCheckbox.addEventListener('change', function () {
            updateTaskCompletion(task.id, completeCheckbox.checked);
        });
        var taskContent = document.createElement('span');
        taskContent.textContent = task.content;
        taskContent.style.flexGrow = '1';
        taskContent.style.textDecoration = task.completed ? 'line-through' : 'none';
        var status = document.createElement('span');
        status.textContent = task.completed ? 'Completed' : 'Not Completed';
        status.classList.add('ml-4');
        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function () {
            deleteTask(task.id);
        });
        taskItem.appendChild(completeCheckbox);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(status);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
    });
}
function deleteTask(taskId) {
    fetch("http://localhost:3000/tasks/".concat(taskId), {
        method: 'DELETE',
    }).then(function () {
        loadTasksFromServer();
    });
}
function updateTaskCompletion(taskId, completed) {
    fetch("http://localhost:3000/tasks/".concat(taskId), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: completed }),
    }).then(function () {
        loadTasksFromServer();
    });
}
