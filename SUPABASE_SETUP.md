# Setting Up Supabase Vector Tables for RAG

Follow these steps to set up your Supabase database with the necessary vector capabilities for your RAG application:

## Option 1: Using the Supabase UI (Recommended)

1. Log in to your Supabase account at https://app.supabase.com
2. Open your project
3. Go to the SQL editor (click "SQL Editor" in the left sidebar)
4. Copy the content of the `supabase_vector_setup.sql` file
5. Paste it into the SQL editor
6. Click "Run" to execute the SQL

This will:

- Enable the vector extension
- Create a documents table with vector capabilities
- Create indexes for faster similarity searches
- Create helper functions for vector similarity searches

## Option 2: Using the Supabase REST API (Advanced)

If you prefer to use the REST API to execute the SQL, follow these steps:

1. First, create the `exec_sql` function in Supabase:
   a. Log in to your Supabase account
   b. Open your project
   c. Go to the SQL editor
   d. Copy the content of the `create_exec_sql_function.sql` file
   e. Paste it into the SQL editor and run it

2. Then execute the setup script:

   ```bash
   node setup_supabase.js
   ```

   This script will:

   - Read the SQL from supabase_vector_setup.sql
   - Send it to Supabase via the REST API
   - Execute it using the exec_sql function we created

## Verifying the Setup

After running the SQL, you should see:

- A new 'documents' table in your database
- The vector extension enabled
- A match_documents function available for vector similarity searches

You can verify this by checking the Tables and Functions sections in the Supabase dashboard.

## Troubleshooting

If you encounter errors:

1. Make sure your Supabase URL and API key are correct
2. Verify that you have admin privileges for your Supabase project
3. Check that the pgvector extension is available on your Supabase plan
4. If using the REST API method, confirm the exec_sql function was created successfully
