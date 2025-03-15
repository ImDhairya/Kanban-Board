let draggedCard = null;
let rightClickedCard = null;
const popup = document.querySelector("#add-board-prompt");
const overlay = document.querySelector("#overlay");
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
    updateFromLocalStorage();
  });
}

const columns = document.querySelectorAll(".column .tasks");

columns.forEach((col) => {
  col.addEventListener("dragover", dragOver);
});

function dragOver(event) {
  event.preventDefault();
  this.appendChild(draggedCard);
  console.log(draggedCard, "asdf");

  const afterElement = getDragAfterElement(this, event.pageY);
  if (afterElement === null) {
    this.appendChild(draggedCard);
  } else {
    this.insertBefore(draggedCard, afterElement);
  }
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".card:not(.dragging)"),
  ];

  const result = draggableElements.reduce(
    (closestElementUnderMouse, currentTask) => {
      const box = currentTask.getBoundingClientRect();
      console.log(box, "HOOOOO");
      const offset = y - box.top - box.height / 2;
      console.log(offset);
      if (offset < 0 && offset > closestElementUnderMouse.offset) {
        return {offset: offset, element: currentTask};
      } else {
        return closestElementUnderMouse;
      }
    },
    {offset: Number.NEGATIVE_INFINITY}
  );
  return result.element;
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
    const newTaskText = prompt("Edit task-");
    const taskDate = new Date().toLocaleString();

    if (newTaskText !== "") {
      // rightClickedCard.textContent = newTaskText;
      const taskElement = editTaskElement(newTaskText, taskDate);
      rightClickedCard.replaceWith(taskElement);
    }
  }
}

function editTaskElement(taskText, taskDate) {
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

function addBoard() {
  const input = document.getElementById(`new-board-input`);
  const board = document.querySelector(".board");
  console.log(input.value, "FF")

  const newBoard = document.createElement("div");
  newBoard.setAttribute("id", input.value);
  newBoard.classList.add("column");
  newBoard.innerHTML = `
    <h2>${input.value} (<span id="${input.value}-count">0</span>)
    <button onclick="deleteBoard(${input.value})" id='del-btn'>Delete</button>
    </h2>
      <div
        class="tasks"
        id="${input.value}-task"></div>
        <input
          type="text"
          class="task-input"
          id="${input.value}-input"
          placeholder="Add a Task"
        />

        <button
          onclick="addTask('${input.value}')"
          class="add-task"
        >
          Add Task
        </button>
  `;
  input.value = "";

  board.append(newBoard);
  console.log(newBoard, "sdf");
  popup.style.display = "none";
  overlay.style.display = "none";
  // newBoard.setAttribute('id', `${}`)

  // referanceBoard.setAttribute("class", `${input.value}-board`);
}

function showAddBoardPopUp() {
  popup.style.display = "block";
  overlay.style.display = "block";

  // --------------------------------------
}

function deleteBoard(boardId) {
  console.log(boardId);
  boardId.remove();
}

document.querySelector(".overlay").addEventListener("click", () => {
  popup.style.display = "none";
  overlay.style.display = "none";
});

// cursor,
// windsurf,
// claudcode,

// learn and do intersection with some other descipline
