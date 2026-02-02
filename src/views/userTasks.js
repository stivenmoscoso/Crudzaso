import { requireRole } from "../state/guards.js";
import { Shell } from "../components/shell.component.js";
import { deleteTask, getTasksByUser, updateTask } from "../api/tasks.api.js";
import { escapeHtml } from "../utils/dom.js";
import { statusBadge } from "../utils/badges.js";

export async function renderUserTasks(root) {
  const user = requireRole("user");
  if (!user) return;

  const shell = Shell({ active: "userTasks" });
  root.appendChild(shell);
  const view = shell.querySelector("#ctView");

  view.innerHTML = `
    <div class="mb-3">
      <img src="public/logo.png" style="width:30px;margin-bottom:10px;">
      <h1 class="h4 mb-1">Task Management</h1>
      <div class="text-muted">Crea, mira y gestiona tus tareas en un solo lugar.</div>
    </div>

    <div class="row g-3 mb-3" id="metrics"></div>
    <div id="err" class="alert alert-danger d-none"></div>

    <div class="ct-card p-3">
      <div class="d-flex gap-2 align-items-center mb-3">
        <input id="q" class="form-control" placeholder="Busca por título, categoría o ID..." style="max-width:380px;">
        <div class="ms-auto"><span class="ct-pill">My tasks only</span></div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr class="text-muted">
              <th style="width: 42%;">Task name</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody id="tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  const metrics = view.querySelector("#metrics");
  const errBox = view.querySelector("#err");
  const tbody = view.querySelector("#tbody");
  const q = view.querySelector("#q");

  let all = [];

  function renderMetrics(tasks) {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === "Pending").length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;

    metrics.innerHTML = `
      <div class="col-12 col-md-3"><div class="ct-card p-3"><div class="text-muted small">Total Tasks</div><div class="h3 m-0">${total}</div></div></div>
      <div class="col-12 col-md-3"><div class="ct-card p-3"><div class="text-muted small">In Progress</div><div class="h3 m-0">${inProgress}</div></div></div>
      <div class="col-12 col-md-3"><div class="ct-card p-3"><div class="text-muted small">Completed</div><div class="h3 m-0">${completed}</div></div></div>
      <div class="col-12 col-md-3"><div class="ct-card p-3"><div class="text-muted small">Pending</div><div class="h3 m-0">${pending}</div></div></div>
    `;
  }

  function renderTable() {
    const query = q.value.trim().toLowerCase();
    let list = [...all];
    if (query) {
      list = list.filter(t =>
        (t.title || "").toLowerCase().includes(query) ||
        (t.category || "").toLowerCase().includes(query) ||
        String(taskId(t)).includes(query)
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-muted">No tasks found.</td></tr>`;
      return;
    }

    function taskId(t) {
  return t.id ?? t._id; 
}

    tbody.innerHTML = list.map(t => `
      <tr data-id="${taskId(t)}">
        <td>
          <div class="fw-semibold">${escapeHtml(t.title)}</div>
          <div class="text-muted small">${escapeHtml(t.description || "")}</div>
          <div class="text-muted small">Due: ${escapeHtml(t.dueDate || "-")}</div>
        </td>
        <td><span class="ct-pill">${escapeHtml(t.category || "-")}</span></td>
        <td>
          <select class="form-select form-select-sm" name="priority">
            ${["Baja","Media","Alta"].map(p => `<option ${t.priority===p?"selected":""}>${p}</option>`).join("")}
          </select>
        </td>
        <td>
          ${statusBadge(t.status)}
          <select class="form-select form-select-sm mt-2" name="status">
            ${["Pending","In Progress","Completed"].map(s => `<option ${t.status===s?"selected":""}>${s}</option>`).join("")}
          </select>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" data-action="save">Save</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete">Delete</button>
        </td>
      </tr>
    `).join("");
  }

  async function load() {
    errBox.classList.add("d-none");
    tbody.innerHTML = `<tr><td colspan="5" class="text-muted">Loading...</td></tr>`;
    try {
      all = await getTasksByUser(user.id);
      console.log("Ejemplo tarea:", all[0]);
      renderMetrics(all);
      renderTable();
    } catch (err) {
      errBox.textContent = err.message;
      errBox.classList.remove("d-none");
      tbody.innerHTML = "";
    }
  }

  q.addEventListener("input", renderTable);

tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const tr = btn.closest("tr");
  const id = tr.dataset.id;

  if (!id) {
    errBox.textContent = "ID de tarea inválido.";
    errBox.classList.remove("d-none");
    return;
  }

  try {
    if (btn.dataset.action === "save") {
      const status = tr.querySelector('select[name="status"]').value;
      const priority = tr.querySelector('select[name="priority"]').value;
      await updateTask(id, { status, priority });
    }

    if (btn.dataset.action === "delete") {
      await deleteTask(id);
    }

    await load();
  } catch (err) {
    errBox.textContent = err.message;
    errBox.classList.remove("d-none");
  }
});

  await load();
}