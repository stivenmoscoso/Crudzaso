import { renderLogin } from "../views/login.js";
import { renderRegister } from "../views/register.js";
import { renderAdminDashboard } from "../views/adminDashboard.js";
import { renderUserTasks } from "../views/userTasks.js";
import { renderProfile } from "../views/profile.js";
import { renderTaskNew } from "../views/taskNew.js";

export function router() {
  const route = location.hash || "#/login";
  const app = document.querySelector("#app");
  app.innerHTML = "";

  switch (route) {
    case "#/login": return renderLogin(app);
    case "#/register": return renderRegister(app);

    // admin
    case "#/admin/dashboard": return renderAdminDashboard(app);

    // user
    case "#/user/tasks": return renderUserTasks(app);
    case "#/user/profile": return renderProfile(app);

    // shared
    case "#/tasks/new": return renderTaskNew(app);

    default:
      location.hash = "#/login";
  }
}

export function initRouter() {
  window.addEventListener("hashchange", router);
  window.addEventListener("DOMContentLoaded", router);
  router();
}