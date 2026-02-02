import { currentUser } from "./auth.js";

export function requireAuth() {
  const u = currentUser();
  if (!u) {
    location.hash = "#/login";
    return null;
  }
  return u;
}

export function requireRole(role) {
  const u = requireAuth();
  if (!u) return null;

  if (u.role !== role) {
    location.hash = u.role === "admin" ? "#/admin/dashboard" : "#/user/tasks";
    return null;
  }
  return u;
}