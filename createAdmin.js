const bcrypt = require('bcrypt');
const pool = require('./db/pool');

async function createAdmin() {
  const username = 'admin'; 
  const plainPassword = 'Gershom@2022'; 

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  try {
    const result = await pool.query(
      `INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at`,
      [username, passwordHash]
    );
    console.log('Admin created:', result.rows[0]);
  } catch (err) {
    console.error('Failed to create admin:', err.message);
  } finally {
    pool.end();
  }
}

createAdmin();