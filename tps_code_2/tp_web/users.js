const USERS_API = 'https://jsonplaceholder.typicode.com/users';
const PER_PAGE  = 6;

const state = {
  allUsers:    [],
  users:       [],
  totalPages:  1,
  currentPage: 1,
  editingUser: null,
};

function normalizeUser(raw) {
  const parts      = (raw.name || '').split(' ');
  const first_name = raw.first_name || parts[0]  || 'Unknown';
  const last_name  = raw.last_name  || parts.slice(1).join(' ') || '';

  return {
    id:         raw.id,
    first_name,
    last_name,
    email:      raw.email    || '',
    job:        raw.job      || raw.username || raw.company?.name || '',
    avatar:     raw.avatar   || null,
  };
}

let ui = {};

function resolveUI() {
  ui = {
    spinner:         document.getElementById('spinner'),
    alertBox:        document.getElementById('users-alert'),
    tableBody:       document.getElementById('users-tbody'),
    emptyState:      document.getElementById('empty-state'),
    pagination:      document.getElementById('pagination'),
    totalCount:      document.getElementById('total-count'),
    pageCount:       document.getElementById('page-indicator'),
    searchInput:     document.getElementById('search-input'),

    addForm:         document.getElementById('add-user-form'),
    addFirstName:    document.getElementById('add-first-name'),
    addLastName:     document.getElementById('add-last-name'),
    addEmail:        document.getElementById('add-email'),
    addJob:          document.getElementById('add-job'),

    editModal:       document.getElementById('edit-modal'),
    editForm:        document.getElementById('edit-user-form'),
    editFirstName:   document.getElementById('edit-first-name'),
    editLastName:    document.getElementById('edit-last-name'),
    editEmail:       document.getElementById('edit-email'),
    editJob:         document.getElementById('edit-job'),
    editSubmitBtn:   document.getElementById('edit-submit-btn'),

    navUserEmail:    document.getElementById('nav-user-email'),
    navUserAvatar:   document.getElementById('nav-user-avatar'),
    logoutBtn:       document.getElementById('logout-btn'),
  };
}

function showSpinner() { ui.spinner.classList.add('active'); }
function hideSpinner() { ui.spinner.classList.remove('active'); }

function showUsersAlert(type, message) {
  showAlert(ui.alertBox, type, message);
}

function initNavbar() {
  const email = getUser();
  if (ui.navUserEmail) ui.navUserEmail.textContent = email;
  if (ui.navUserAvatar) {
    ui.navUserAvatar.textContent = email ? email[0].toUpperCase() : 'U';
  }
  if (ui.logoutBtn) {
    ui.logoutBtn.addEventListener('click', logout);
  }
}

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

async function fetchUsers(page = 1) {
  showSpinner();
  try {
    if (state.allUsers.length === 0) {
      const raw        = await apiFetch(USERS_API);
      state.allUsers   = raw.map(normalizeUser);
    }

    const total       = state.allUsers.length;
    state.totalPages  = Math.ceil(total / PER_PAGE);
    state.currentPage = page;

    const start    = (page - 1) * PER_PAGE;
    state.users    = state.allUsers.slice(start, start + PER_PAGE);

    if (ui.totalCount) ui.totalCount.textContent = total;
    if (ui.pageCount)  ui.pageCount.textContent  =
      `Page ${page} of ${state.totalPages}`;

    renderTable(state.users);
    renderPagination(page, state.totalPages);

  } catch (err) {
    console.error('fetchUsers error:', err);
    showUsersAlert('error', `Failed to load users: ${err.message}`);
    renderTable([]);
  } finally {
    hideSpinner();
  }
}

async function createUser(userData) {
  showSpinner();
  try {
    const created = await apiFetch(USERS_API, {
      method: 'POST',
      body:   JSON.stringify(userData),
    });

    const newUser = normalizeUser({ ...userData, id: created.id ?? 11 });

    showUsersAlert('success',
      `User "${newUser.first_name} ${newUser.last_name}" created successfully! (ID: ${newUser.id})`);

    state.allUsers.push(newUser);
    await fetchUsers(state.currentPage);

  } catch (err) {
    console.error('createUser error:', err);
    showUsersAlert('error', `Failed to create user: ${err.message}`);
  } finally {
    hideSpinner();
  }
}

async function updateUser(id, userData) {
  showSpinner();
  try {
    await apiFetch(`${USERS_API}/${id}`, {
      method: 'PUT',
      body:   JSON.stringify(userData),
    });

    const idx = state.allUsers.findIndex(u => u.id === id);
    if (idx !== -1) {
      state.allUsers[idx] = normalizeUser({ ...state.allUsers[idx], ...userData, id });
    }

    showUsersAlert('success', `User #${id} updated successfully!`);

    closeEditModal();
    await fetchUsers(state.currentPage);

  } catch (err) {
    console.error('updateUser error:', err);
    showUsersAlert('error', `Failed to update user: ${err.message}`);
  } finally {
    hideSpinner();
  }
}

async function deleteUser(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?\nThis action cannot be undone.`)) return;

  showSpinner();
  try {
    await apiFetch(`${USERS_API}/${id}`, { method: 'DELETE' });

    showUsersAlert('success', `User "${name}" has been deleted.`);

    state.allUsers = state.allUsers.filter(u => u.id !== id);

    const remainingOnPage = state.users.filter(u => u.id !== id).length;
    const targetPage = remainingOnPage === 0 && state.currentPage > 1
      ? state.currentPage - 1
      : state.currentPage;

    await fetchUsers(targetPage);

  } catch (err) {
    console.error('deleteUser error:', err);
    showUsersAlert('error', `Failed to delete user: ${err.message}`);
    hideSpinner();
  }
}

function renderTable(users) {
  if (!users || users.length === 0) {
    ui.tableBody.innerHTML = '';
    ui.emptyState.style.display = 'block';
    return;
  }

  ui.emptyState.style.display = 'none';

  ui.tableBody.innerHTML = users.map(user => `
    <tr data-id="${user.id}">
      <td>
        <div class="user-cell">
          <img src="${user.avatar || 'https://ui-avatars.com/api/?name=' +
            encodeURIComponent(`${user.first_name} ${user.last_name}`) +
            '&background=ede9fe&color=4f46e5'}"
               alt="Avatar of ${user.first_name}"
               onerror="this.src='https://ui-avatars.com/api/?name=${
                 encodeURIComponent(user.first_name)}&background=ede9fe&color=4f46e5'">
          <div>
            <div class="name">${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}</div>
            <div class="email">${escapeHtml(user.email)}</div>
          </div>
        </div>
      </td>
      <td>#${user.id}</td>
      <td class="email-col">${escapeHtml(user.email)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-sm btn-primary btn-edit"
                  data-id="${user.id}"
                  title="Edit user">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582
                   16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0
                   011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
            </svg>
            Edit
          </button>
          <button class="btn btn-sm btn-danger btn-delete"
                  data-id="${user.id}"
                  data-name="${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}"
                  title="Delete user">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107
                   1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244
                   2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456
                   0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114
                   1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18
                   -.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037
                   -2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderPagination(current, total) {
  if (!ui.pagination) return;

  if (total <= 1) {
    ui.pagination.innerHTML = '';
    return;
  }

  let html = `
    <button class="page-btn" id="prev-page" ${current === 1 ? 'disabled' : ''}>
      &lsaquo;
    </button>`;

  for (let i = 1; i <= total; i++) {
    html += `<button class="page-btn ${i === current ? 'active' : ''}"
                     data-page="${i}">${i}</button>`;
  }

  html += `
    <button class="page-btn" id="next-page" ${current === total ? 'disabled' : ''}>
      &rsaquo;
    </button>`;

  ui.pagination.innerHTML = html;

  ui.pagination.querySelector('#prev-page')?.addEventListener('click', () => {
    if (state.currentPage > 1) fetchUsers(state.currentPage - 1);
  });
  ui.pagination.querySelector('#next-page')?.addEventListener('click', () => {
    if (state.currentPage < state.totalPages) fetchUsers(state.currentPage + 1);
  });

  ui.pagination.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => fetchUsers(Number(btn.dataset.page)));
  });
}

function attachTableEvents() {
  ui.tableBody.addEventListener('click', event => {
    const editBtn   = event.target.closest('.btn-edit');
    const deleteBtn = event.target.closest('.btn-delete');

    if (editBtn) {
      const id   = Number(editBtn.dataset.id);
      const user = state.users.find(u => u.id === id);
      if (user) openEditModal(user);
    }

    if (deleteBtn) {
      const id   = Number(deleteBtn.dataset.id);
      const name = deleteBtn.dataset.name;
      deleteUser(id, name);
    }
  });
}

function initAddForm() {
  if (!ui.addForm) return;

  ui.addForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!validateUserForm(
          ui.addFirstName, ui.addLastName, ui.addEmail, ui.addJob)) return;

    const userData = {
      first_name: ui.addFirstName.value.trim(),
      last_name:  ui.addLastName.value.trim(),
      email:      ui.addEmail.value.trim(),
      job:        ui.addJob.value.trim(),
    };

    await createUser(userData);
    ui.addForm.reset();
  });
}

function openEditModal(user) {
  state.editingUser = user;

  ui.editFirstName.value = user.first_name  || '';
  ui.editLastName.value  = user.last_name   || '';
  ui.editEmail.value     = user.email       || '';
  ui.editJob.value       = user.job         || '';

  const title = ui.editModal.querySelector('.modal-header h3');
  if (title) title.textContent = `Edit User #${user.id}`;

  ui.editModal.classList.add('active');
}

function closeEditModal() {
  ui.editModal.classList.remove('active');
  state.editingUser = null;
  ui.editForm?.reset();
}

function initEditModal() {
  if (!ui.editModal) return;

  ui.editModal.addEventListener('click', event => {
    if (event.target === ui.editModal) closeEditModal();
  });

  ui.editModal.querySelector('.modal-close')?.addEventListener('click', closeEditModal);

  ui.editModal.querySelector('#edit-cancel-btn')?.addEventListener('click', closeEditModal);

  ui.editForm?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!state.editingUser) return;

    if (!validateUserForm(
          ui.editFirstName, ui.editLastName, ui.editEmail, ui.editJob)) return;

    const userData = {
      first_name: ui.editFirstName.value.trim(),
      last_name:  ui.editLastName.value.trim(),
      email:      ui.editEmail.value.trim(),
      job:        ui.editJob.value.trim(),
    };

    await updateUser(state.editingUser.id, userData);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeEditModal();
  });
}

function validateUserForm(firstNameInput, lastNameInput, emailInput, jobInput) {
  let valid = true;

  [firstNameInput, lastNameInput, emailInput, jobInput].forEach(el => {
    if (el) setFieldError(el, '');
  });

  if (!firstNameInput.value.trim()) {
    setFieldError(firstNameInput, 'First name is required.');
    valid = false;
  }

  if (!lastNameInput.value.trim()) {
    setFieldError(lastNameInput, 'Last name is required.');
    valid = false;
  }

  if (!emailInput.value.trim()) {
    setFieldError(emailInput, 'Email is required.');
    valid = false;
  } else if (!isValidEmail(emailInput.value)) {
    setFieldError(emailInput, 'Please enter a valid email address.');
    valid = false;
  }

  if (!jobInput.value.trim()) {
    setFieldError(jobInput, 'Job / role is required.');
    valid = false;
  }

  return valid;
}

function initSearch() {
  if (!ui.searchInput) return;

  ui.searchInput.addEventListener('input', () => {
    const term = ui.searchInput.value.toLowerCase().trim();

    if (!term) {
      renderTable(state.users);
      return;
    }

    const filtered = state.users.filter(u =>
      u.first_name.toLowerCase().includes(term) ||
      u.last_name.toLowerCase().includes(term)  ||
      u.email.toLowerCase().includes(term)
    );

    renderTable(filtered);
  });
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();

  resolveUI();
  initNavbar();

  attachTableEvents();
  initAddForm();
  initEditModal();
  initSearch();

  fetchUsers(1);
});
