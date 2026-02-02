import { findUserByEmail, createUser } from "../api/users.api.js";
import { setSession, clearSession, getSession } from "./session.js";

export function currentUser() {
  return getSession()?.user || null;
}

export function logout() {
  clearSession();
}

export async function login({ email, password }) {
  const users = await findUserByEmail(email);
  if (users.length === 0) throw new Error("Credenciales inválidas.");
  const user = users[0];
  if (user.password !== password) throw new Error("Credenciales inválidas.");

  setSession({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  return user;
}

export async function register({ name, email, password, confirmPassword }) {
  if (password !== confirmPassword) throw new Error("Las contraseñas no coinciden.");

  const existing = await findUserByEmail(email);
  if (existing.length > 0) throw new Error("El correo ya está registrado.");

  const user = await createUser({ name, email, password, role: "user" });
  setSession({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  return user;
}