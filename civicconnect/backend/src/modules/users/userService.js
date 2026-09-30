// User use cases (stub).
const userRepository = require('./userRepository');

async function getProfile(id) {
  return userRepository.findById(id);
}

module.exports = { getProfile };
