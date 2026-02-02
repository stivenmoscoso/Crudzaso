import { login, currentUser } from "../state/auth.js";

export function renderLogin(root) {
  const u = currentUser();
  if (u) {
    location.hash = u.role === "admin" ? "#/admin/dashboard" : "#/user/tasks";
    return;
  }

  root.innerHTML = `

   <div class="ct-auth-wrap">

    <div class="text-center mb-3">
      <img src="public/logo.png" alt="CRUDZASO" style="width:60px;margin-bottom:10px;">
      <div style="font-weight:900;line-height:1;">
        <div>CRUDZASO</div>
       
      </div>

    <div class="ct-auth-wrap">
      <div class="ct-auth-card">
        <div class="text-center mb-3">
          <div style="font-weight:900;font-size:22px;">Welcome back</div>
          <div class="text-muted">Enter your credentials to access the platform</div>
        </div>

        <div id="err" class="alert alert-danger d-none"></div>

        <form id="form">
          <div class="mb-3">
            <label class="form-label">Email or username</label>
            <input class="form-control" name="email" type="email" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input class="form-control" name="password" type="password" required />
          </div>

          <div class="text-end mb-3">
            <a class="small" href="#/login" onclick="return false;">Forgot password?</a>
          </div>

          <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>

          <div class="text-center mt-3 small">
            Don't have an account?
            <a href="#/register">Register</a>
          </div>

          <hr class="my-3">
          <div class="small text-muted">
            Demo admin: admin@gmail.com / 123456 <br>
            Demo user: user@gmail.com / 123456
          </div>
        </form>
      </div>
    </div>
  `;

  const form = root.querySelector("#form");
  const errBox = root.querySelector("#err");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errBox.classList.add("d-none");
    const data = Object.fromEntries(new FormData(form));

    try {
      const user = await login(data);
      location.hash = user.role === "admin" ? "#/admin/dashboard" : "#/user/tasks";
    } catch (err) {
      errBox.textContent = err.message;
      errBox.classList.remove("d-none");
    }
  });
}