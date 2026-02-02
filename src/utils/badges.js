export function statusBadge(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("progress")) return `<span class="ct-badge progress">In Progress</span>`;
  if (s.includes("complete")) return `<span class="ct-badge completed">Completed</span>`;
  return `<span class="ct-badge pending">Pending</span>`;
}