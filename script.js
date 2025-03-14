let draggedCard = null;
let rightClickedCard = null;

document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage());

function addTask(columnId) {
  const input = document.getElementById(`${columnId}-input`);
  console.log(input.value);
  const taskText = input.value;
  if (taskText === "") {
    return;
  }

  const taskDate = new Date().toLocaleString();
  const taskElement = createTaskElement(taskText, taskDate);

  document.getElementById(`${columnId}-task`).append(taskElement);
  updateTasksCount(columnId);
  saveTasksToLocalStorage(columnId, taskText, taskDate);
  input.value = "";
}

function createTaskElement(taskText, taskDate) {
  const element = document.createElement("div");
  element.innerHTML = `<span> ${taskText}</span><br><small class="time">${taskDate}</small>`;
  element.classList.add("card");
  // element.draggable = true;
  element.setAttribute("draggable", true);
  element.addEventListener("dragstart", dragStart);
  element.addEventListener("dragend", dragEnd);
  element.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    rightClickedCard = this;
    showContextMenu(e.pageX, e.pageY);
  });
  const time = 213;
  return element;
}

function dragStart() {
  console.log(this, "asdf");
  this.classList.add("dragging");
  draggedCard = this;
}

function dragEnd() {
  this.classList.remove("dragging");
  draggedCard = null;
  ["todo", "doing", "done"].forEach((columnId) => {
    updateTasksCount(columnId);
  });
}

const columns = document.querySelectorAll(".column .tasks");

columns.forEach((col) => {
  col.addEventListener("dragover", dragOver);
});

function dragOver(event) {
  event.preventDefault();
  this.appendChild(draggedCard);
  updateFromLocalStorage();
  console.log(draggedCard, "asdf");
}

const contextmenu = document.querySelector(".context-menu");
function showContextMenu(x, y) {
  console.log(x, y);
  contextmenu.style.left = `${x}px`;
  contextmenu.style.top = `${y}px`;
  contextmenu.style.display = "block";
}

document.addEventListener("click", () => {
  contextmenu.style.display = "none";
});

function editTask() {
  if (rightClickedCard !== null) {
    const newTaskText = prompt("Edit task-", rightClickedCard.textContent);
    if (newTaskText !== "") {
      rightClickedCard.textContent = newTaskText;
    }
  }
}

function deleteTask() {
  const colId = rightClickedCard.parentElement.id;
  if (rightClickedCard !== null) {
    rightClickedCard.remove();
  }
  // console.log(colId.slice(0, -5));
  updateTasksCount(colId.slice(0, -5));
  updateFromLocalStorage();
}

function updateTasksCount(columnId) {
  const count = document.querySelectorAll(`#${columnId}-task .card`).length;
  document.getElementById(`${columnId}-count`).textContent = count;
}

function saveTasksToLocalStorage(columnId, taskText, taskDate) {
  const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
  tasks.push({text: taskText, date: taskDate});
  localStorage.setItem(columnId, JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  ["todo", "doing", "done"].forEach((columnId) => {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
    tasks.forEach(({text, date}) => {
      const taskElement = createTaskElement(text, date);
      // document.getElementById(`${columnId}-task`);

      document.getElementById(`${columnId}-task`).appendChild(taskElement);
      updateTasksCount(columnId);
    });
  });
}
function updateFromLocalStorage() {
  ["todo", "doing", "done"].forEach((columnId) => {
    const tasks = [];
    document.querySelectorAll(`#${columnId}-task .card`).forEach((card) => {
      const taskText = card.querySelector("span").textContent;
      const taskDate = card.querySelector("small").textContent;
      tasks.push({text: taskText, date: taskDate});
    });
    localStorage.setItem(columnId, JSON.stringify(tasks));
  });
}
