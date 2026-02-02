import { request } from "./http.js";

export function findUserByEmail(email) {
  return request(`/users?email=${encodeURIComponent(email)}`);
}

export function createUser(payload) {
  return request(`/users`, { method: "POST", body: JSON.stringify(payload) });
}

export function getUsers() {
  return request(`/users`);
}