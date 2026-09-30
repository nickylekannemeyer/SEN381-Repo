// Translates HTTP into service calls for the requests module.
const service = require('./requestService');

async function changeStatus(req, res) {
  try {
    const { id } = req.params;
    const { target, note } = req.body;
    const result = await service.changeRequestStatus(Number(id), target, req.user.id, note);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { changeStatus };
