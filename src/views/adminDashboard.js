import { requireRole } from "../state/guards.js";
import { Shell } from "../components/shell.component.js";
import { deleteTask, getAllTasks, updateTask } from "../api/tasks.api.js";
import { escapeHtml } from "../utils/dom.js";
import { statusBadge } from "../utils/badges.js";

export async function renderAdminDashboard(root) {
  const admin = requireRole("admin");
  if (!admin) return;

  const shell = Shell({ active: "adminDashboard" });
  root.appendChild(shell);
  const view = shell.querySelector("#ctView");

  view.innerHTML = `
    <div class="mb-3">
     <img src="public/logo.png" style="width:30px;margin-bottom:10px;">
      <h1 class="h4 mb-1">Task Manager</h1>
      <div class="text-muted">Vision General de todas las tareas.</div>
    </div>

    <div id="err" class="alert alert-danger d-none"></div>

    <div class="row g-3 mb-3" id="metrics"></div>

    <div class="ct-card p-3">
      <div class="d-flex gap-2 align-items-center mb-3">
        <input id="q" class="form-control" placeholder="Search tasks..." style="max-width:360px;">
        <div class="ms-auto d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm" data-filter="all">All Tasks</button>
          <button class="btn btn-outline-secondary btn-sm" data-filter="Pending">Pending</button>
          <button class="btn btn-outline-secondary btn-sm" data-filter="Completed">Completed</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr class="text-muted">
              <th>Task name</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due date</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody id="tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  const errBox = view.querySelector("#err");
  const metrics = view.querySelector("#metrics");
  const tbody = view.querySelector("#tbody");
  const q = view.querySelector("#q");

  let all = [];
  let filter = "all";

  function renderMetrics(tasks) {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === "Pending").length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const pct = total ? Math.round((completed / total) * 100) : 0;

    metrics.innerHTML = `
      <div class="col-12 col-md-3"><div class="ct-card p-3"><div class="text-muted small">Total Tasks</div><div class="display-6">${total}</div></div></div>
      <div class="col-12 col-md-3"><div class="ct-card p-3"><div class="text-muted small">Completed</div><div class="display-6">${completed}</div></div></div>
      <div class="col-12 col-md-3"><div class="ct-card p-3"><div class="text-muted small">Pending</div><div class="display-6">${pending}</div></div></div>
      <div class="col-12 col-md-3"><div class="ct-card p-3"><div class="text-muted small">Overall Progress</div><div class="display-6">${pct}%</div></div></div>
    `;
  }

  function applyFilter() {
    const query = q.value.trim().toLowerCase();
    let list = [...all];

    if (filter !== "all") list = list.filter(t => t.status === filter);
    if (query) list = list.filter(t =>
      (t.title || "").toLowerCase().includes(query) ||
      (t.category || "").toLowerCase().includes(query) ||
      String(taskId(t)).includes(query)
    );

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-muted">No tasks found.</td></tr>`;
      return;
    }

    function taskId(t) {
  return t.id ?? t._id;
}

    tbody.innerHTML = list.map(t => `
      <tr data-id="${taskId(t)}">
        <td>
          <div class="fw-semibold">${escapeHtml(t.title)}</div>
          <div class="text-muted small">${escapeHtml(t.category || "")}</div>
        </td>
        <td><span class="ct-pill">User #${t.userId}</span></td>
        <td>
          ${statusBadge(t.status)}
          <select class="form-select form-select-sm mt-2" name="status">
            ${["Pending","In Progress","Completed"].map(s => `<option ${t.status===s?"selected":""}>${s}</option>`).join("")}
          </select>
        </td>
        <td>
          <select class="form-select form-select-sm" name="priority">
            ${["Low","Medium","High"].map(p => `<option ${t.priority===p?"selected":""}>${p}</option>`).join("")}
          </select>
        </td>
        <td>${escapeHtml(t.dueDate || "-")}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" data-action="save">Save</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete">Delete</button>
        </td>
      </tr>
    `).join("");
  }

  async function load() {
    errBox.classList.add("d-none");
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted">Loading...</td></tr>`;
    try {
      all = await getAllTasks();
      renderMetrics(all);
      applyFilter();
    } catch (err) {
      errBox.textContent = err.message;
      errBox.classList.remove("d-none");
      tbody.innerHTML = "";
    }
  }

  view.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      applyFilter();
    });
  });

  q.addEventListener("input", applyFilter);

  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const tr = btn.closest("tr");
    const id = tr?.dataset.id;

    if (!id) {
      errBox.textContent = "ID de tarea inválido.";
      errBox.classList.remove("d-none");
      return;
    }

    try {
      if (btn.dataset.action === "delete") await deleteTask(id);
      if (btn.dataset.action === "save") {
        const status = tr.querySelector('select[name="status"]').value;
        const priority = tr.querySelector('select[name="priority"]').value;
        await updateTask(id, { status, priority });
      }
      await load();
    } catch (err) {
      errBox.textContent = err.message;
      errBox.classList.remove("d-none");
    }
  });

  await load();
}