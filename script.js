let draggedCard = null;
let rightClickedCard = null;

function addTask(columnId) {
  const input = document.getElementById(`${columnId}-input`);
  console.log(input.value);
  const taskText = input.value;
  if (taskText === "") {
    return;
  }

  const taskDate = new Date().toLocaleString();
  const taskElement = createTaskElement(taskText, taskDate);

  input.value = "";
  document.getElementById(`${columnId}-task`).append(taskElement);
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
}

const columns = document.querySelectorAll(".column .tasks");

columns.forEach((col) => {
  col.addEventListener("dragover", dragOver);
});

function dragOver(event) {
  event.preventDefault();
  this.appendChild(draggedCard);
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
  if (rightClickedCard !== null) {
    rightClickedCard.remove();
  }
}
