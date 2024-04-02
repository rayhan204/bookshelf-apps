const todos = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "TODO_APPS";

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of todos) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in todos) {
    if (todos[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    todos.push(...data);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const textTitle = document.createElement("h2");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = author;

  const textYear = document.createElement("p");
  textYear.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${id}`);

  const actionButtons = document.createElement("div");
  actionButtons.classList.add("action");

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum selesai di Baca";
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.innerText = "Hapus buku";
    removeButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    actionButtons.append(undoButton, removeButton);
  } else {
    const completeButton = document.createElement("button");
    completeButton.classList.add("green");
    completeButton.innerText = "Selesai dibaca";
    completeButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.innerText = "Hapus buku";
    removeButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    actionButtons.append(completeButton, removeButton);
  }

  container.append(actionButtons);
  return container;
}

function addBook() {
  const textBook = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const textYear = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const generateID = generateId();
  const bookObject = generateTodoObject(generateID, textBook, textAuthor, textYear, isCompleted);
  todos.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(bookId) {
  const todoTarget = findBook(bookId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId) {
  const todoTarget = findBook(bookId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookId) {
  const todoTargetIndex = findBookIndex(bookId);
  if (todoTargetIndex === -1) return;

  todos.splice(todoTargetIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBookByTitle() {
  const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
  const filterBooks = todos.filter((book) => book.title.toLowerCase().includes(searchTitle));

  const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
  const listCompleted = document.getElementById("completeBookshelfList");

  uncompletedBOOKList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookItem of filterBooks) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("searchBook");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBookByTitle();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data telah disimpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
  const listCompleted = document.getElementById("completeBookshelfList");

  uncompletedBOOKList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookItem of todos) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
});
