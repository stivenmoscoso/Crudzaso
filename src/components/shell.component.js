import { el } from "../utils/dom.js";
import { currentUser, logout } from "../state/auth.js";

export function Shell({ active = "" } = {}) {
  const user = currentUser();

  const node = el(`
    <div class="ct-shell">
      <aside class="ct-sidebar">
        <div class="ct-brand">
          <div style="width:34px;height:34px;border-radius:10px;background:#0f172a;color:#fff;display:grid;place-items:center;font-weight:800;">
            C
          </div>
          <div>
            <div style="font-weight:900;">CRUDZASO</div>
            <div style="font-size:12px;color:#64748b;">Task Manager</div>
          </div>
        </div>

        <nav class="ct-nav">
          ${user?.role === "admin" ? `
            <a href="#/admin/dashboard" class="${active==="adminDashboard"?"active":""}">Dashboard</a>
          ` : `
            <a href="#/user/tasks" class="${active==="userTasks"?"active":""}">My Tasks</a>
            <a href="#/user/profile" class="${active==="profile"?"active":""}">Profile</a>
          `}
        </nav>
      </aside>

      <main class="ct-main">
        <header class="ct-topbar">
          <strong>${user?.role === "admin" ? "Dashboard" : (active==="profile" ? "My Profile" : "Task Management")}</strong>

          <div class="d-flex align-items-center gap-3">
            <a class="btn btn-primary btn-sm" href="#/tasks/new">+ New Task</a>
            <div class="small text-muted">${user ? `${user.name} (${user.role})` : ""}</div>
            <button id="btnLogout" class="btn btn-outline-danger btn-sm">Salir</button>
          </div>
        </header>

        <section class="ct-content" id="ctView"></section>
      </main>
    </div>
  `);

  node.querySelector("#btnLogout").addEventListener("click", () => {
    logout();
    location.hash = "#/login";
  });

  return node;
}