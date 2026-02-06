const statusEl = document.getElementById("status");
const countEl = document.getElementById("count");
const listEl = document.getElementById("userList");
const emptyEl = document.getElementById("empty");
const formEl = document.getElementById("createForm");
const nameInput = document.getElementById("name");
const refreshBtn = document.getElementById("refresh");
const focusCreateBtn = document.getElementById("focusCreate");
const modalEl = document.getElementById("editModal");
const modalForm = document.getElementById("editForm");
const modalInput = document.getElementById("editName");
const modalClose = document.getElementById("modalClose");
const modalCancel = document.getElementById("cancelEdit");

let activeUser = null;
let activeTitle = null;

const setStatus = (text) => {
  statusEl.textContent = text;
};

const setCount = (count) => {
  countEl.textContent = count;
};

const openModal = (user, titleEl) => {
  activeUser = user;
  activeTitle = titleEl;
  modalInput.value = user.name;
  modalEl.classList.add("open");
  modalEl.setAttribute("aria-hidden", "false");
  modalInput.focus();
};

const closeModal = () => {
  modalEl.classList.remove("open");
  modalEl.setAttribute("aria-hidden", "true");
  activeUser = null;
  activeTitle = null;
};

const createUserCard = (user) => {
  const li = document.createElement("li");
  li.className = "user-card";

  const details = document.createElement("div");
  details.className = "user-meta";

  const title = document.createElement("strong");
  title.textContent = user.name;
  title.className = "user-name";

  const idLine = document.createElement("small");
  idLine.textContent = `ID: ${user.id}`;

  details.appendChild(title);
  details.appendChild(idLine);

  const actions = document.createElement("div");
  actions.className = "user-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "ghost";
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "primary";
  deleteBtn.textContent = "Delete";

  editBtn.addEventListener("click", () => {
    openModal(user, title);
  });

  deleteBtn.addEventListener("click", async () => {
    setStatus("Deleting user...");
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      li.remove();
      updateEmptyState();
      setStatus("User deleted");
    } catch (err) {
      setStatus("Delete failed. Try again.");
    }
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(details);
  li.appendChild(actions);

  return li;
};

const updateEmptyState = () => {
  const hasUsers = listEl.children.length > 0;
  emptyEl.style.display = hasUsers ? "none" : "block";
  setCount(listEl.children.length);
};

const renderUsers = (users) => {
  listEl.innerHTML = "";
  users.forEach((user) => listEl.appendChild(createUserCard(user)));
  updateEmptyState();
};

const fetchUsers = async () => {
  setStatus("Loading users...");
  try {
    const res = await fetch("/api/users");
    if (!res.ok) {
      throw new Error("Failed");
    }
    const users = await res.json();
    renderUsers(users);
    setStatus("Up to date");
  } catch (err) {
    setStatus("Unable to load users");
  }
};

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    setStatus("Name is required");
    return;
  }
  setStatus("Creating user...");
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      throw new Error("Create failed");
    }
    const newUser = await res.json();
    listEl.prepend(createUserCard(newUser));
    nameInput.value = "";
    updateEmptyState();
    setStatus("User created");
  } catch (err) {
    setStatus("Create failed. Try again.");
  }
});

modalForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!activeUser) {
    return;
  }
  const name = modalInput.value.trim();
  if (!name) {
    setStatus("Name is required");
    return;
  }
  setStatus("Updating user...");
  try {
    const res = await fetch(`/api/users/${activeUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      throw new Error("Update failed");
    }
    const updated = await res.json();
    if (activeTitle) {
      activeTitle.textContent = updated.name;
    }
    closeModal();
    setStatus("User updated");
  } catch (err) {
    setStatus("Update failed. Try again.");
  }
});

modalClose.addEventListener("click", closeModal);
modalCancel.addEventListener("click", closeModal);
modalEl.addEventListener("click", (event) => {
  if (event.target === modalEl) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalEl.classList.contains("open")) {
    closeModal();
  }
});

refreshBtn.addEventListener("click", fetchUsers);
focusCreateBtn.addEventListener("click", () => nameInput.focus());

fetchUsers();
