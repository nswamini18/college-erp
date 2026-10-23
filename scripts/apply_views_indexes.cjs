const fs = require('fs');
const path = require('path');
const { pool, query } = require('../server/config/db');

async function applySQL() {
  console.log('--- Applying Views ---');
  const viewsSql = fs.readFileSync(path.join(__dirname, '../database/views.sql'), 'utf8');
  // Strip multi-line comments and single line comments
  const cleanViewsSql = viewsSql
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/--.*$/gm, '');

  const viewStatements = cleanViewsSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.toLowerCase().startsWith('use'));

  for (const stmt of viewStatements) {
    if (stmt.toUpperCase().includes('CREATE OR REPLACE VIEW')) {
      const viewNameMatch = stmt.match(/VIEW\s+`?(\w+)`?/i);
      const name = viewNameMatch ? viewNameMatch[1] : 'view';
      process.stdout.write(`Creating view ${name}... `);
      await query(stmt);
      console.log('DONE.');
    }
  }

  console.log('--- Applying Indexes ---');
  const indexesSql = fs.readFileSync(path.join(__dirname, '../database/indexes.sql'), 'utf8');
  const cleanIndexesSql = indexesSql
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/--.*$/gm, '')
    .replace(/IF NOT EXISTS\s+/gi, ''); // MySQL 8 doesn't support IF NOT EXISTS in CREATE INDEX

  const indexStatements = cleanIndexesSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.toLowerCase().startsWith('use'));

  for (const stmt of indexStatements) {
    if (stmt.toUpperCase().includes('CREATE INDEX')) {
      const indexMatch = stmt.match(/INDEX\s+`?(\w+)`?/i);
      const name = indexMatch ? indexMatch[1] : 'index';
      process.stdout.write(`Creating index ${name}... `);
      try {
        await query(stmt);
        console.log('DONE.');
      } catch (e) {
        if (e.code === 'ER_DUP_KEYNAME') {
          console.log('ALREADY EXISTS.');
        } else {
          console.log(`ERROR: ${e.message}`);
        }
      }
    }
  }

  console.log('\n--- Verifying Views in MySQL ---');
  const [views] = await query("SELECT TABLE_NAME FROM information_schema.VIEWS WHERE TABLE_SCHEMA = 'college_erp'");
  console.log('Active Views:', views.map(v => v.TABLE_NAME));
}

applySQL()
  .then(() => {
    console.log('\nAll views and indexes applied successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
