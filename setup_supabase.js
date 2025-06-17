// Script to execute SQL to set up Supabase vector tables
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPERBASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPERBASE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPERBASE_URL and SUPERBASE_KEY environment variables must be set');
  process.exit(1);
}

// Read the SQL file
const sqlPath = path.join(__dirname, 'supabase_vector_setup.sql');
let sqlContent;

try {
  sqlContent = fs.readFileSync(sqlPath, 'utf8');
} catch (err) {
  console.error(`Error reading SQL file: ${err.message}`);
  process.exit(1);
}

// Make the API request to Supabase
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
};

// Create URL for REST API database queries
const restUrl = `${supabaseUrl}/rest/v1/rpc/exec_sql`;

const data = JSON.stringify({
  sql_string: sqlContent
});

const req = https.request(restUrl, options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('SQL executed successfully');
      console.log(responseData);
    } else {
      console.error(`Error executing SQL: ${res.statusCode}`);
      console.error(responseData);
    }
  });
});

req.on('error', (error) => {
  console.error(`Error making request: ${error.message}`);
});

req.write(data);
req.end();

console.log('Sending SQL to Supabase...');
