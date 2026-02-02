import { request } from "./http.js";

export function getAllTasks() {
  return request(`/tasks`);
}

export function getTasksByUser(userId) {
  return request(`/tasks?userId=${userId}`);
}

export function createTask(payload) {
  return request(`/tasks`, { method: "POST", body: JSON.stringify(payload) });
}

export function updateTask(id, payload) {
  return request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: "DELETE" });
}