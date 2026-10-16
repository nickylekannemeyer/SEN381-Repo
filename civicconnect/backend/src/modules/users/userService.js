const userRepository = require('./userRepository');
const { toUserView } = require('../../shared/views');
async function getProfile(id) {
  const u = await userRepository.findById(id);
  return u ? toUserView(u) : null;
}
module.exports = { getProfile };
