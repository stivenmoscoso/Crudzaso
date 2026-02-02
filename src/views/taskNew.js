import { requireAuth } from "../state/guards.js";
import { currentUser } from "../state/auth.js";
import { Shell } from "../components/shell.component.js";
import { createTask } from "../api/tasks.api.js";
import { getUsers } from "../api/users.api.js";

export async function renderTaskNew(root) {
  const me = requireAuth();
  if (!me) return;

  const shell = Shell({ active: me.role === "admin" ? "adminDashboard" : "userTasks" });
  root.appendChild(shell);
  const view = shell.querySelector("#ctView");

  view.innerHTML = `
    <div class="mb-3">
      <a href="${me.role==="admin" ? "#/admin/dashboard" : "#/user/tasks"}" class="text-decoration-none small">&larr; Back to Tasks</a>
      <h1 class="h4 mt-2">Create New Task</h1>
    </div>

    <div id="err" class="alert alert-danger d-none"></div>
    <div id="ok" class="alert alert-success d-none"></div>

    <div class="ct-card p-3 p-md-4" style="max-width: 920px;">
      <form id="form">
        <div class="mb-3">
          <label class="form-label">Task Title <span class="text-danger">*</span></label>
          <input class="form-control" name="title" required>
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Category</label>
            <select class="form-select" name="category">
              <option value="">Select category...</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>History</option>
              <option>Computer Science</option>
              <option>Literature</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">Priority</label>
            <select class="form-select" name="priority">
              <option>Low</option>
              <option selected>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">Status</label>
            <select class="form-select" name="status">
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">Due Date</label>
            <input class="form-control" name="dueDate" type="date">
          </div>

          <div class="col-md-6 ${me.role === "admin" ? "" : "d-none"}">
            <label class="form-label">Assignee (User)</label>
            <select class="form-select" name="userId" id="userId"></select>
          </div>
        </div>

        <div class="mt-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" name="description" rows="5"></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <a class="btn btn-outline-secondary" href="${me.role==="admin" ? "#/admin/dashboard" : "#/user/tasks"}">Cancel</a>
          <button class="btn btn-primary" type="submit">Save Task</button>
        </div>
      </form>
    </div>
  `;

  const form = view.querySelector("#form");
  const errBox = view.querySelector("#err");
  const okBox = view.querySelector("#ok");

  if (me.role === "admin") {
    const userSelect = view.querySelector("#userId");
    const users = await getUsers();
    const onlyUsers = users.filter(u => u.role === "user");
    userSelect.innerHTML = onlyUsers.map(u => `<option value="${u.id}">${u.name} (#${u.id})</option>`).join("");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errBox.classList.add("d-none");
    okBox.classList.add("d-none");

    const data = Object.fromEntries(new FormData(form));

    try {
      const userId = me.role === "admin" ? Number(data.userId) : currentUser().id;

      await createTask({
        title: data.title.trim(),
        description: (data.description || "").trim(),
        category: data.category || "",
        priority: data.priority || "Medium",
        status: data.status || "Pending",
        dueDate: data.dueDate || "",
        userId,
        createdAt: new Date().toISOString()
      });

      okBox.textContent = "Tarea creada correctamente.";
      okBox.classList.remove("d-none");

      form.reset();
      form.querySelector('select[name="priority"]').value = "Medium";
      form.querySelector('select[name="status"]').value = "Pending";

    } catch (err) {
      errBox.textContent = err.message;
      errBox.classList.remove("d-none");
    }
  });
}