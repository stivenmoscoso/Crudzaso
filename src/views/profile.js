import { requireRole } from "../state/guards.js";
import { Shell } from "../components/shell.component.js";
import { getTasksByUser } from "../api/tasks.api.js";

export async function renderProfile(root) {
  const user = requireRole("user");
  if (!user) return;

  const shell = Shell({ active: "profile" });
  root.appendChild(shell);
  const view = shell.querySelector("#ctView");

  let tasksCount = 0;
  try {
    const tasks = await getTasksByUser(user.id);
    tasksCount = tasks.length;
  } catch {}

  view.innerHTML = `
    <div class="mb-3">
      <h1 class="h4 mb-1">My Profile</h1>
    </div>

    <div class="row g-3">
      <div class="col-12 col-lg-4">
        <div class="ct-card p-3">
          <div class="d-flex flex-column align-items-center text-center py-3">
            <div style="width:92px;height:92px;border-radius:999px;background:#e2e8f0;"></div>
            <div class="mt-3 fw-bold">${user.name}</div>
            <div class="ct-pill mt-1">User</div>
            <div class="text-muted small mt-2">${user.email}</div>
            <div class="mt-3">
              <div class="h4 m-0">${tasksCount}</div>
              <div class="text-muted small">Tasks</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-8">
        <div class="ct-card p-3">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="fw-semibold">Personal Information</div>
            <button class="btn btn-outline-secondary btn-sm" disabled>Edit Profile</button>
          </div>

          <div class="row g-3 mt-1">
            <div class="col-md-6">
              <div class="text-muted small">Full Name</div>
              <div class="fw-semibold">${user.name}</div>
            </div>
            <div class="col-md-6">
              <div class="text-muted small">Role</div>
              <div class="fw-semibold">${user.role}</div>
            </div>
            <div class="col-md-6">
              <div class="text-muted small">Email</div>
              <div class="fw-semibold">${user.email}</div>
            </div>
            <div class="col-md-6">
              <div class="text-muted small">User ID</div>
              <div class="fw-semibold">${user.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}