// Translates HTTP into service calls for the requests module.
const service = require('./requestService');
const roles = require('../auth/roles');

function handle(res, err) {
  const status = err.httpStatus || 400;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: err.code || 'ERROR', message: err.message });
}

async function create(req, res) {
  try {
    const r = await service.submitRequest({
      requesterId: req.user.id, title: req.body.title, description: req.body.description,
      category: req.body.category, idempotencyKey: req.header('x-idempotency-key')
    });
    res.status(r.idempotent ? 200 : 201).json({ idempotent: r.idempotent, data: r.request });
  } catch (err) { handle(res, err); }
}

async function list(req, res) {
  try {
    const scope = req.user.role === roles.REQUESTER ? { requesterId: req.user.id } : {};
    const data = await service.listRequests({
      ...scope, status: req.query.status, category: req.query.category,
      sort: req.query.sort, order: req.query.order
    });
    res.json({ data });
  } catch (err) { handle(res, err); }
}

async function getOne(req, res) {
  try {
    const view = await service.getRequest(Number(req.params.id));
    if (req.user.role === roles.REQUESTER && view.requesterId !== req.user.id) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    res.json({ data: view });
  } catch (err) { handle(res, err); }
}

async function assign(req, res) {
  try {
    const staffId = req.body.staffId ? Number(req.body.staffId) : req.user.id;
    res.json({ data: await service.assignRequest(Number(req.params.id), staffId) });
  } catch (err) { handle(res, err); }
}

async function changeStatus(req, res) {
  try {
    const data = await service.changeRequestStatus(
      Number(req.params.id), req.body.target, req.user.id, req.body.note,
          req.body.version === undefined ? undefined : Number(req.body.version), req.header('x-idempotency-key'));
    res.json({ data });
  } catch (err) { handle(res, err); }
}

module.exports = { create, list, getOne, assign, changeStatus };
