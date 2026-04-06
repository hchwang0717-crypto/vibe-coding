const todoInput = document.getElementById("todoInput");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todoList");
const emptyMessage = document.getElementById("emptyMessage");

let todoItems = [];

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadTodos() {
  chrome.storage.local.get(["todoItems"], (result) => {
    const storedTodoItems = result.todoItems || [];

    todoItems = storedTodoItems.map((todoItem) => {
      return {
        ...todoItem,
        date: todoItem.date || getTodayDateString()
      };
    });

    saveTodos();
    renderTodos();
  });
}

function saveTodos() {
  chrome.storage.local.set({ todoItems });
}

function renderTodos() {
  todoList.innerHTML = "";

  if (todoItems.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  todoItems.forEach((todoItem, todoIndex) => {
    const listItem = document.createElement("li");
    listItem.className = "todoItem";

    const leftArea = document.createElement("div");
    leftArea.className = "todoLeft";

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = todoItem.completed;
    checkBox.addEventListener("change", () => {
      toggleTodo(todoIndex);
    });

    const contentArea = document.createElement("div");
    contentArea.className = "todoContent";

    const textSpan = document.createElement("span");
    textSpan.className = "todoText";
    if (todoItem.completed) {
      textSpan.classList.add("completed");
    }
    textSpan.textContent = todoItem.text;

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.className = "todoDate";
    dateInput.value = todoItem.date || getTodayDateString();
    dateInput.addEventListener("change", (event) => {
      updateTodoDate(todoIndex, event.target.value);
    });

    contentArea.appendChild(textSpan);
    contentArea.appendChild(dateInput);

    const deleteButton = document.createElement("button");
    deleteButton.className = "deleteButton";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", () => {
      deleteTodo(todoIndex);
    });

    leftArea.appendChild(checkBox);
    leftArea.appendChild(contentArea);

    listItem.appendChild(leftArea);
    listItem.appendChild(deleteButton);

    todoList.appendChild(listItem);
  });
}

function addTodo() {
  const todoText = todoInput.value.trim();

  if (!todoText) {
    return;
  }

  const todoItem = {
    id: Date.now(),
    text: todoText,
    completed: false,
    date: getTodayDateString()
  };

  todoItems.push(todoItem);
  saveTodos();
  renderTodos();
  todoInput.value = "";
}

function toggleTodo(todoIndex) {
  todoItems[todoIndex].completed = !todoItems[todoIndex].completed;
  saveTodos();
  renderTodos();
}

function updateTodoDate(todoIndex, newDateValue) {
  if (!newDateValue) {
    return;
  }

  todoItems[todoIndex].date = newDateValue;
  saveTodos();
}

function deleteTodo(todoIndex) {
  todoItems.splice(todoIndex, 1);
  saveTodos();
  renderTodos();
}

addButton.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

loadTodos();