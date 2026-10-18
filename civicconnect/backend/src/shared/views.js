// Presentation shaping, kept separate from persistence (never leak sensitive fields).
const OVERDUE_DAYS = 7;
function isOverdue(row) {
  if (row.status === 'Resolved' || row.status === 'Closed') return false;
  const created = new Date(row.created_at).getTime();
  if (Number.isNaN(created)) return false;
  return (Date.now() - created) > OVERDUE_DAYS * 24 * 60 * 60 * 1000;
}
function toRequestView(row) {
  return {
    id: row.id, requesterId: row.requester_id, assignedTo: row.assigned_to,
    title: row.title, description: row.description, category: row.category,
    status: row.status, version: row.version, isOverdue: isOverdue(row),
    createdAt: row.created_at, updatedAt: row.updated_at
  };
}
function toUserView(row) { return { id: row.id, email: row.email, role: row.role }; }
module.exports = { toRequestView, toUserView, OVERDUE_DAYS };
