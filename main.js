let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let msg = document.getElementById("msg");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let add = document.getElementById("add");
let tasks = document.getElementById("tasks");
let modal = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  formValidation();
});

let editIndex = null;

let formValidation = () => {
  if (textInput.value === "") {
    console.log("failure");
    msg.innerHTML = "Task cannot be blank";
  } else {
    console.log("success");
    msg.innerHTML = "";

    if (editIndex !== null) {
      updateTask();
    } else {
      acceptData();
    }

    // Close modal only after successful submission
    add.setAttribute("data-bs-dismiss", "modal"); // to close modal automatically
    add.click();

    // Reset attributes after closing
    setTimeout(() => {
      add.setAttribute("data-bs-dismiss", "");
      add.innerHTML = "Add";
    }, 100); // Small delay to ensure modal closes
  }
};

let data = [];

let acceptData = () => {
  data.push({
    text: textInput.value,
    date: dateInput.value,
    description: textarea.value,
    completed: false, // completed status
  });

  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);

  createTasks();
};

let updateTask = () => {
  if (editIndex === null) return;
  data[editIndex] = {
    text: textInput.value,
    date: dateInput.value,
    description: textarea.value,
    completed: data[editIndex].completed, // Preserve completed status
  };

  localStorage.setItem("data", JSON.stringify(data));

  createTasks();
  editIndex = null;
  add.innerHTML = "Add";
};

let createTasks = () => {
  tasks.innerHTML = "";
  data.map((x, y) =>
    //x=current element ; y=index, y represents the index of the current element in the data array. if y =0 => Creates <div id="0"> with "Task 1" details.
    {
      return (tasks.innerHTML += `
            <div id=${y}>
            <div class="name-date">
            <span class="fw-bold ${x.completed ? "completed" : ""}">${
        x.text
      }</span>
            <span class="small text-secondary">${x.date}</span>
            </div>
            <p class="dis ${x.completed ? "completed" : ""}">${
        x.description
      }</p>

            <span class="options">
            <span class="check"><input type="checkbox" class="complete-task"
                 ${x.completed ? "checked" : ""}
                 onchange="toggleComplete(${y})">Mark as completed </span>
          <span class="icon"> <i onClick= "editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick ="deleteTask(this);createTasks()" class="fas fa-trash-alt"></i></span>

            </span>
            </div>`);
    }
  );

  resetForm();
};

// toReset the form inputs and editIndex when the modal is closed or canceled. because editIndex and the form state aren’t cleared.

modal.addEventListener("hidden.bs.modal", () => {
  resetForm();
  editIndex = null;
  add.innerHTML = "Add"; // Ensures button text resets to "Add"
});

let resetForm = () => {
  textInput.value = "";
  dateInput.value = "";
  textarea.value = "";
};

let deleteTask = (e) => {
  let delTaskDiv = e.parentElement.parentElement.parentElement.remove();

  data.splice(e.parentElement.parentElement.parentElement.id, 1);

  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);
};

let editTask = (e) => {
  let selectedTask = e.parentElement.parentElement.parentElement;
  editIndex = parseInt(selectedTask.id);

   
  textInput.value = selectedTask.querySelector(".fw-bold").innerHTML;
  dateInput.value = selectedTask.querySelector(".text-secondary").innerHTML;
  textarea.value = selectedTask.children[1].innerHTML; 

  add.innerHTML = "Update";
};

let toggleComplete = (index) => {
  data[index].completed = !data[index].completed;
  localStorage.setItem("data", JSON.stringify(data));
  createTasks(); // Refresh the display
};

// getting data from local storage
//IIFE -Immediately Invoked Function Expression
(() => {
  data = JSON.parse(localStorage.getItem("data")) || [];
  console.log(data);

  createTasks();
})();
