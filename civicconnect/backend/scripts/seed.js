// Seeds the three roles (bcrypt passwords), sample requests and categories-as-strings.
require('dotenv').config();
const pool = require('../src/config/db');
const { hashPassword } = require('../src/modules/auth/passwords');
async function main() {
  const pw = await hashPassword('changeme');
  await pool.query('DELETE FROM request_history');
  await pool.query('DELETE FROM requests');
  await pool.query('DELETE FROM users');
  const ins = async (email, role) => (await pool.query(
    'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id', [email, pw, role])).rows[0].id;
  const requester = await ins('requester@civicconnect.local', 'requester');
  const staff = await ins('staff@civicconnect.local', 'staff');
  const manager = await ins('manager@civicconnect.local', 'management');
  await pool.query(
    `INSERT INTO requests (requester_id, title, description, category) VALUES ($1, $2, $3, $4)`,
    [requester, 'Fix the park gate', 'The latch is broken and needs welding.', 'Maintenance']);
  console.log(`Seed complete. requester #${requester}, staff #${staff}, manager #${manager}. Password: changeme`);
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
