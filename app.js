'use strict';

// FocusFlow: complete Create -> Validate -> Persist -> List feature path.
const STORAGE_KEY = 'focusflow.tasks.v1';
const $ = (selector) => document.querySelector(selector);
const taskList = $('#taskList');
const emptyState = $('#emptyState');
const dialog = $('#taskDialog');
const form = $('#taskForm');
let tasks = loadTasks();
let filter = 'all';
let toastTimeout;

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((item) => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.completed === 'boolean') : [];
  } catch (error) {
    console.warn('Could not read saved tasks', error);
    return [];
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.warn('Could not save tasks', error);
    showToast('Unable to save. Check browser storage settings.');
    return false;
  }
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
}

function makeElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function render() {
  const activeCount = tasks.filter((task) => !task.completed).length;
  const doneCount = tasks.length - activeCount;
  $('#totalCount').textContent = tasks.length;
  $('#activeCount').textContent = activeCount;
  $('#doneCount').textContent = doneCount;
  $('#taskHeadingCount').textContent = tasks.length;

  const visible = tasks.filter((task) => filter === 'all' || (filter === 'active' ? !task.completed : task.completed));
  taskList.replaceChildren();
  emptyState.hidden = visible.length > 0;
  if (visible.length === 0) {
    $('#emptyTitle').textContent = tasks.length === 0 ? 'A fresh start!' : filter === 'completed' ? 'Nothing completed yet' : filter === 'active' ? 'All caught up!' : 'No tasks to show';
    $('#emptyText').textContent = tasks.length === 0 ? 'You have no tasks yet. Add your first one and get going.' : filter === 'completed' ? 'Finish a task to see it here.' : 'There are no unfinished tasks. Great work!';
    $('#emptyAddBtn').hidden = tasks.length !== 0;
  }

  visible.forEach((task) => {
    const item = makeElement('article', `task-item${task.completed ? ' completed' : ''}`);
    const checkbox = makeElement('input', 'task-checkbox');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `${task.completed ? 'Mark incomplete' : 'Complete'}: ${task.title}`);
    checkbox.addEventListener('change', () => {
      const previous = task.completed;
      task.completed = checkbox.checked;
      if (!persist()) { task.completed = previous; checkbox.checked = previous; }
      render();
    });
    const body = makeElement('div', 'task-body');
    body.append(makeElement('div', 'task-name', task.title));
    if (task.description) body.append(makeElement('p', 'task-description', task.description));
    if (task.dueDate) {
      const due = new Date(`${task.dueDate}T12:00:00`);
      if (!Number.isNaN(due.getTime())) body.append(makeElement('span', 'task-date', `Due ${due.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}`));
    }
    const deleteBtn = makeElement('button', 'delete-button', '×');
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('aria-label', `Delete: ${task.title}`);
    deleteBtn.addEventListener('click', () => {
      if (!window.confirm(`Delete "${task.title}"?`)) return;
      const previous = tasks;
      tasks = tasks.filter((item) => item.id !== task.id);
      if (!persist()) tasks = previous;
      else showToast('Task deleted');
      render();
    });
    item.append(checkbox, body, deleteBtn);
    taskList.append(item);
  });
}

function clearErrors() {
  ['taskTitle', 'taskDescription'].forEach((id) => { $(`#${id}`).removeAttribute('aria-invalid'); });
  $('#titleError').textContent = '';
  $('#descriptionError').textContent = '';
}

function openForm() {
  form.reset();
  clearErrors();
  dialog.showModal();
  $('#taskTitle').focus();
}
function closeForm() { dialog.close(); }

function validate(title, description) {
  clearErrors();
  if (!title) {
    $('#titleError').textContent = 'Task title is required.';
    $('#taskTitle').setAttribute('aria-invalid', 'true');
    $('#taskTitle').focus();
    return false;
  }
  if (title.length < 3) {
    $('#titleError').textContent = 'Enter at least 3 characters.';
    $('#taskTitle').setAttribute('aria-invalid', 'true');
    $('#taskTitle').focus();
    return false;
  }
  if (title.length > 80) {
    $('#titleError').textContent = 'Use 80 characters or fewer.';
    $('#taskTitle').setAttribute('aria-invalid', 'true');
    $('#taskTitle').focus();
    return false;
  }
  if (description.length > 300) {
    $('#descriptionError').textContent = 'Use 300 characters or fewer.';
    $('#taskDescription').setAttribute('aria-invalid', 'true');
    $('#taskDescription').focus();
    return false;
  }
  return true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = $('#taskTitle').value.trim();
  const description = $('#taskDescription').value.trim();
  const dueDate = $('#taskDate').value;
  if (!validate(title, description)) return;
  const newTask = {id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, title, description, dueDate, completed: false, createdAt: new Date().toISOString()};
  tasks.unshift(newTask);
  if (!persist()) { tasks.shift(); return; }
  filter = 'all';
  updateFilters();
  render();
  closeForm();
  showToast('Task created successfully!');
});

function updateFilters() {
  document.querySelectorAll('.filter').forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  updateFilters();
  render();
}));
['#headerAddBtn', '#sectionAddBtn', '#emptyAddBtn'].forEach((selector) => $(selector).addEventListener('click', openForm));
['#cancelDialogBtn', '#closeDialogBtn'].forEach((selector) => $(selector).addEventListener('click', closeForm));
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeForm(); });
$('#todayLabel').textContent = new Date().toLocaleDateString(undefined, {weekday:'long', month:'short', day:'numeric', year:'numeric'});
render();
